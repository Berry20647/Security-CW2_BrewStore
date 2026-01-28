import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/api";
import API, { addEmail, removeEmail, generateBackupCodes, getBackupCodesCount, getCsrfToken } from "../api/api";
import toast from "react-hot-toast";
import { FaUserCircle, FaLock, FaCamera, FaUpload, FaShieldAlt, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";
import coverImage from "../assets/cover.jpg";


export default function Profile() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    dob: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("personal"); // personal, security, emails
  // ... other states (2FA, emails, backup codes) kept same but omitting detailed logic for brevity in this redesign snippet, 
  // ensuring the structure supports them. 
  // I will include the full functional logic but wrapped in the new UI.

  const [savingPassword, setSavingPassword] = useState(false);
  const [twoFA, setTwoFA] = useState({ enabled: false });
  const [qr, setQr] = useState("");
  const [twoFASecret, setTwoFASecret] = useState("");
  const [twoFACode, setTwoFACode] = useState("");
  const [twoFASetup, setTwoFASetup] = useState(false);
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [backupCodes, setBackupCodes] = useState([]);
  const [backupCount, setBackupCount] = useState(null);
  const [backupLoading, setBackupLoading] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    console.log("Profile: useEffect triggered");
    getProfile()
      .then((data) => {
        if (!data) throw new Error("No profile data received");
        console.log("Profile: Data received", data);
        setForm({
          name: data?.name || "",
          phone: data?.phone || "",
          email: data?.email || "",
          address: data?.address || "",
          dob: data?.dob ? data.dob.split('T')[0] : "",
        });
        setEmails(data?.emails || []);
        setTwoFA({ enabled: !!data?.twoFactorEnabled });
        setProfileImage(data?.profileImage || "");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Profile: Failed to load", err);
        toast.error(err.message || "Failed to load profile");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (twoFA.enabled) {
      getBackupCodesCount()
        .then((data) => setBackupCount(data.count))
        .catch(() => setBackupCount(null));
    }
  }, [twoFA.enabled]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmNewPassword } = passwords;
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setSavingPassword(true);
    try {
      await updateProfile({ password: newPassword, currentPassword });
      toast.success("Password changed successfully");
      setPasswords({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  // 2FA Handlers
  const handleEnable2FA = async () => {
    setTwoFALoading(true);
    try {
      const res = await API.post("/users/2fa/generate");
      setQr(res.data.qr);
      setTwoFASecret(res.data.secret);
      setTwoFASetup(true);
    } catch (err) {
      toast.error("Failed to start 2FA setup");
    } finally { setTwoFALoading(false); }
  };

  const handleConfirm2FA = async (e) => {
    e.preventDefault();
    setTwoFALoading(true);
    try {
      await API.post("/users/2fa/confirm", { code: twoFACode });
      toast.success("2FA enabled");
      setTwoFA({ enabled: true });
      setTwoFASetup(false);
    } catch (err) {
      toast.error("Failed to enable 2FA");
    } finally { setTwoFALoading(false); }
  };

  const handleDisable2FA = async () => {
    setTwoFALoading(true);
    try {
      await API.post("/users/2fa/disable");
      toast.success("2FA disabled");
      setTwoFA({ enabled: false });
    } catch (err) {
      toast.error("Failed to disable 2FA");
    } finally { setTwoFALoading(false); }
  };

  const handleGenerateBackupCodes = async () => {
    setBackupLoading(true);
    try {
      const res = await generateBackupCodes();
      setBackupCodes(res.backupCodes);
      setBackupCount(res.backupCodes.length);
      toast.success("Backup codes generated");
    } catch (err) {
      toast.error("Failed to generate backup codes");
    } finally { setBackupLoading(false); }
  };

  const handleAddEmail = async (e) => {
    e.preventDefault();
    setEmailLoading(true);
    try {
      await addEmail(newEmail);
      toast.success("Verification email sent");
      setEmails((prev) => [...prev, { address: newEmail, verified: false }]);
      setNewEmail("");
    } catch (err) {
      toast.error("Failed to add email");
    } finally { setEmailLoading(false); }
  };

  const handleRemoveEmail = async (address) => {
    setEmailLoading(true);
    try {
      await removeEmail(address);
      setEmails((prev) => prev.filter((e) => e.address !== address));
      toast.success("Email removed");
    } catch (err) {
      toast.error("Failed to remove email");
    } finally { setEmailLoading(false); }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('profileImage', file);
    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch('http://localhost:5001/api/users/profile/image', {
        method: 'PUT',
        body: formData,
        credentials: 'include',
        headers: { "X-CSRF-Token": csrfToken },
      });
      if (!response.ok) throw new Error('Failed to upload image');
      const data = await response.json();
      setProfileImage(data.profileImage);
      toast.success("Image updated");
    } catch (err) {
      toast.error(err.message);
    } finally { setUploadingImage(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream text-coffee-bean font-serif text-xl">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-cream font-sans">
      {/* Header Profile Section */}
      <div className="bg-coffee-bean pt-20 pb-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/coffee.png')]"></div>
        <div className="relative z-10">
          <div className="w-32 h-32 mx-auto rounded-full p-1 bg-gradient-to-tr from-caramel to-rich-roast mb-6 relative">
            <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 border-4 border-coffee-bean relative group">
              {profileImage ? (
                <img src={`http://localhost:5001/uploads/${profileImage}`} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-rich-roast text-white text-4xl font-serif">
                  {form.name ? form.name.charAt(0) : <FaUserCircle />}
                </div>
              )}
              {/* Upload Overlay */}
              <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <FaCamera className="text-white text-2xl" />
                <input type="file" accept="image/*" onChange={handleProfileImageUpload} className="hidden" disabled={uploadingImage} />
              </label>
            </div>
            {uploadingImage && <div className="absolute bottom-0 right-0 w-6 h-6 bg-caramel rounded-full animate-ping"></div>}
          </div>

          <h1 className="text-3xl font-serif font-bold text-cream mb-2">{form.name}</h1>
          <p className="text-latte/80 text-sm">{form.email}</p>
        </div>
      </div>

      {/* Main Content / Tabs */}
      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-20 pb-20">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[500px]">
          {/* Tab Nav */}
          <div className="flex border-b border-gray-100">
            {[
              { id: "personal", label: "Personal Info", icon: FaUserCircle },
              { id: "emails", label: "Email Accounts", icon: FaEnvelope },
              { id: "security", label: "Security & 2FA", icon: FaShieldAlt },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-semibold transition-all ${activeTab === tab.id
                  ? "text-coffee-bean border-b-2 border-caramel bg-cream/30"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <tab.icon size={16} />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === "personal" && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <InputGroup label="Full Name" name="name" value={form.name} onChange={handleChange} />
                  <InputGroup label="Phone" name="phone" value={form.phone} onChange={handleChange} />
                  <InputGroup label="Address" name="address" value={form.address} onChange={handleChange} />
                  <InputGroup label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} />
                </div>
                <div className="pt-4">
                  <button type="submit" disabled={saving} className="btn-primary w-full md:w-auto">
                    {saving ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>
              </motion.form>
            )}

            {activeTab === "emails" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    className="flex-1 input-field"
                    placeholder="Add new email address..."
                  />
                  <button onClick={handleAddEmail} disabled={emailLoading} className="btn-secondary">Add</button>
                </div>

                <div className="space-y-3">
                  {emails.map((e) => (
                    <div key={e.address} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <span className="text-coffee-bean font-medium">{e.address}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${e.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {e.verified ? "VERIFIED" : "PENDING"}
                        </span>
                      </div>
                      {e.address !== form.email && (
                        <button onClick={() => handleRemoveEmail(e.address)} className="text-red-400 hover:text-red-600 text-sm font-medium">Remove</button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                {/* Password Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-serif font-bold text-coffee-bean">Change Password</h3>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <InputGroup label="Current Password" name="currentPassword" type="password" value={passwords.currentPassword} onChange={handlePasswordChange} />
                    <div className="grid md:grid-cols-2 gap-4">
                      <InputGroup label="New Password" name="newPassword" type="password" value={passwords.newPassword} onChange={handlePasswordChange} />
                      <InputGroup label="Confirm New Password" name="confirmNewPassword" type="password" value={passwords.confirmNewPassword} onChange={handlePasswordChange} />
                    </div>
                    <button type="submit" disabled={savingPassword} className="btn-secondary">Update Password</button>
                  </form>
                </div>

                <div className="h-px bg-gray-100"></div>

                {/* 2FA Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-serif font-bold text-coffee-bean">Two-Factor Authentication</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${twoFA.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {twoFA.enabled ? "ENABLED" : "DISABLED"}
                    </span>
                  </div>

                  {!twoFA.enabled && !twoFASetup && (
                    <button onClick={handleEnable2FA} disabled={twoFALoading} className="btn-primary w-full">Enable 2FA Protection</button>
                  )}

                  {twoFASetup && (
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <p className="text-sm text-gray-600 mb-4 text-center">Scan QR with Authenticator App</p>
                      {qr && <img src={qr} alt="QR" className="mx-auto w-48 h-48 mb-4 bg-white p-2 rounded-lg" />}
                      <form onSubmit={handleConfirm2FA} className="flex gap-2">
                        <input value={twoFACode} onChange={e => setTwoFACode(e.target.value)} placeholder="Enter code" className="input-field text-center tracking-widest" required />
                        <button type="submit" className="btn-primary whitespace-nowrap">Verify</button>
                      </form>
                      <button onClick={() => setTwoFASetup(false)} className="text-xs text-red-400 mt-2 block mx-auto hover:underline">Cancel Setup</button>
                    </div>
                  )}

                  {twoFA.enabled && (
                    <div className="space-y-4">
                      <button onClick={handleDisable2FA} className="w-full border border-red-200 text-red-500 py-2 rounded-lg hover:bg-red-50 transition">Disable 2FA</button>

                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-coffee-bean text-sm">Backup Codes</h4>
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">{backupCount !== null ? backupCount : "?"} remaining</span>
                        </div>
                        <button onClick={handleGenerateBackupCodes} disabled={backupLoading} className="text-sm text-caramel hover:text-coffee-bean font-medium">Generate New Codes</button>
                        {backupCodes.length > 0 && (
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            {backupCodes.map((c, i) => <div key={i} className="bg-white border text-center py-1 rounded text-sm font-mono text-gray-600">{c}</div>)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const InputGroup = ({ label, type = "text", ...props }) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
    <input type={type} className="input-field" {...props} />
  </div>
);
