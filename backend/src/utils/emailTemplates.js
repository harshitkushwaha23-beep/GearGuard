export const Reset_Email_Template = (otpCode, logoUrl, userName) => `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
        />
        <style>
            * {
                box-sizing: border-box;
            }

            body {
                width: 100%;
                font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f9f9;
                margin: 0;
                padding: 0;
            }

            .container {
                width: 100%;
                padding: 20px;
                display: flex;
                justify-content: center;
            }

            .box {
                width: 100%;
                max-width: 500px;
                background: #ffffff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                color: #333333;
                border: 1px solid #e1e4e8;
            }

            .logo-container {
                text-align: center;
                margin-bottom: 25px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 35px;
                font-weight: 700;
            }
            .logo {
                max-height: 40px;
                width: auto;
                margin-right: 10px;
            }
            .logotext-1 {
                color: #005f73;
            }
            .logotext-2 {
                color: #ee9b00;
            }
            .content {
                font-size: 16px;
                line-height: 1.6;
                color: #555555;
                text-align: left;
            }
            .code-container {
                margin: 30px 0;
                text-align: center;
            }
            .code {
                display: inline-block;
                max-width: 100%;
                background: #ffffff;
                color: #0f766e;
                padding: 15px 25px;
                border-radius: 8px;
                font-size: 28px;
                letter-spacing: 4px;
                font-weight: bold;
                border: 1px dashed #0f766e;
                word-break: break-all;
            }

            .footer {
                margin-top: 30px;
                text-align: center;
                color: #999999;
                font-size: 12px;
                border-top: 1px solid #eeeeee;
                padding-top: 15px;
            }
            .link {
                color: #0f766e;
                text-decoration: none;
            }

            @media (max-width: 480px) {
                .code {
                    font-size: 24px;
                    letter-spacing: 3px;
                    padding: 12px 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="box">
                <div class="logo-container">
                    <img
                        src="${logoUrl}"
                        alt="StockMaster Logo"
                        class="logo"
                    />
                    <span class="logotext-1">Stock</span>
                    <span class="logotext-2">Master</span>
                </div>

               <!-- <div class="header">
                    <h1>Password Reset Request</h1>
                </div> -->

                <div class="content">
                    <p>${userName},</p>
                    <p>We received a request to reset the password for your StockMaster account.</p>
                    <p>Please use the one time verification code below to proceed:</p>
                </div>

                <div class="code-container">
                    <span class="code">${otpCode}</span>
                </div>

                <!-- <div class="content">
                    <p style="font-size: 14px; color: #777">
                        This code will expire in 10 minutes. If you did not request this, you can safely ignore this email.
                    </p>
                </div> -->

                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} StockMaster. All rights reserved.</p>
                    <p>
                        Need help?
                        <a
                            href="#"
                            class="link"
                            >Contact Support</a
                        >
                    </p>
                </div>
            </div>
        </div>
    </body>
</html>
`;

export const Password_Reset_Notification = (logoUrl, userName) => `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
        />
        <style>
            * {
                box-sizing: border-box;
            }
            body {
                width: 100%;
                font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f9f9;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                padding: 20px;
                display: flex;
                justify-content: center;
            }
            .box {
                width: 100%;
                max-width: 500px;
                background: #ffffff;
                padding: 30px;
                border-radius: 10px;
                border: 1px solid #e1e4e8;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                color: #333333;
            }
            .logo-container {
                text-align: center;
                margin-bottom: 25px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 35px;
                font-weight: 700;
            }
            .logo {
                max-height: 40px;
                width: auto;
                margin-right: 10px;
            }
            .logotext-1 {
                color: #005f73;
            }
            .logotext-2 {
                color: #ee9b00;
            }
            .content {
                font-size: 16px;
                line-height: 1.6;
                color: #555555;
            }
            .alert {
                margin: 25px 0;
                padding: 15px;
                background-color: #fff3cd;
                border: 1px solid #ffeeba;
                border-radius: 8px;
                color: #856404;
                font-size: 14px;
            }
            .alert a {
                color: #856404;
                text-decoration: underline;
            }
            .footer {
                margin-top: 30px;
                text-align: center;
                color: #999999;
                font-size: 12px;
                border-top: 1px solid #eeeeee;
                padding-top: 15px;
            }
            .link {
                color: #0f766e;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="box">
                <div class="logo-container">
                    <img
                        src="${logoUrl}"
                        class="logo"
                    />
                    <span class="logotext-1">Stock</span>
                    <span class="logotext-2">Master</span>
                </div>

                <div class="content">
                    <p>${userName},</p>
                    <p>
                        This is a confirmation that the password for your
                        <strong>StockMaster</strong> account has been successfully reset.
                    </p>
                </div>

                <div class="alert">
                    <strong>Didn’t reset your password?</strong><br />
                    If you did not make this change, please reset your password immediately from <a href="#">here</a>.
                </div>

                <div class="content">
                    <p>Keeping your account secure is our top priority.</p>
                </div>

                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} StockMaster. All rights reserved.</p>
                    <p>
                        Need help?
                        <a
                            href="#"
                            class="link"
                            >Contact Support</a
                        >
                    </p>
                </div>
            </div>
        </div>
    </body>
</html>
`;
