const forgotPasswordTemplate = ({ name, otp }) => {
  return `
  <div>
    <p>Dear, ${name}</p>
    <p>You requested a password reset. Please use the following OTP to reset your password</p>
    <div style="background:yellow;font-size:20px;padding:20px;text-align:center;font-weight:800;">
    ${otp}
    </div>
    <p>This OTP is valid for 1 hour only, enter this OTP in Grocery-it website to proceed with
       resetting your password</p>
       <br />
       <br />
       <p>Thanks<p/>
       <p>Grocery-it<p/>
  </div>
  `;
};

export default forgotPasswordTemplate;
