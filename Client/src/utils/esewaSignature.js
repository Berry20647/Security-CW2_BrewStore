import CryptoJS from "crypto-js";

export const generateEsewaSignature = ({
  total_amount,
  transaction_uuid,
  product_code = "EPAYTEST",
}) => {
  const signedFieldNames = "total_amount,transaction_uuid,product_code";
  const secret = "8gBm/:&EnhH.1/q"; // UAT secret key

  const signatureString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  const signature = CryptoJS.HmacSHA256(signatureString, secret).toString(
    CryptoJS.enc.Base64
  );

  return { signedFieldNames, signature };
}; 


//id=9806800001
//password= Nepal@123
//mpin=  1122
//token=123456