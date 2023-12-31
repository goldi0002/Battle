$(document).ready(() => {
  var IsLoggedIn=SessionHandler.getSession("IsLoggedIn");
  if(IsLoggedIn!=null){
    window.location.href='./index.html'
  }
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const ajaxRequest = (url, method, data, successCallback, errorCallback, key) => {
      const settings = {
          url,
          method,
          headers: {
            "content-type": "application/json",
            'apikey': x_suppaBase_key,
          },
          data: JSON.stringify(data)
      };
      $.ajax(settings).done(successCallback).fail(errorCallback);
  };
  const checkEmailOnServer = (email, successCallback,errorCallback) => {
      const url = `https://ytbdhqwafvmhaucvkfwa.supabase.co/rest/v1/a_battle_user_?email_address=eq.${email}`;
      ajaxRequest(url, "GET", null, successCallback, errorCallback, x_suppaBase_key);
  };

  const handleFieldValidation = (field, errorSelector, errorMessage) => {
      const value = field.val().trim();
      errorSelector.html(value === "" ? errorMessage : "").toggle(value === "");
      return value;
  };
  const RegisterUserOnServer=(successCallback)=>{
    let data= {
        user_name: handleFieldValidation($("#_userSignUpName"), $("#_userSignUpName_error"), "Please enter username!"),
        email_address: handleFieldValidation($("#_userSignUpEmail"), $("#_userSignUpEmail_error"), "Please enter email!"),
        password: handleFieldValidation($("#_userSignUpPassword"), $("#_userSignUpPassword_error"), "Please enter password!"),
        user_type: 'BADMIN',
        created_at:new Date().toISOString(),
        is_active:true
    }
    const url = `https://ytbdhqwafvmhaucvkfwa.supabase.co/rest/v1/a_battle_user_`;
    ajaxRequest(url, "POST", data, successCallback, console.error, x_suppaBase_key);
  }
  const AddLoginActivityOnServer=(user_seq,successCallback)=>{
      let login_activity_data={
        a_battle_user_seq:user_seq,
        login_time:new Date().toISOString(),
        activity_start_time:new Date().toISOString(),
        is_active:true
      }
      const url = `https://ytbdhqwafvmhaucvkfwa.supabase.co/rest/v1/a_battle_user_login_activity`;
      ajaxRequest(url, "POST", login_activity_data, successCallback, console.error, x_suppaBase_key);    
  }
  const validationScript = {
      registration: () => {
         $("#_userREgisterDoneSpan").hide();
          const userName = handleFieldValidation($("#_userSignUpName"), $("#_userSignUpName_error"), "Username is required.");
          const userPassword = handleFieldValidation($("#_userSignUpPassword"), $("#_userSignUpPassword_error"), "Password is required.");
          const userEmail = handleFieldValidation($("#_userSignUpEmail"), $("#_userSignUpEmail_error"), "Email is required.");
          if (userName !== "" && userPassword !== "" && userEmail !== "" && isValidEmail(userEmail) && userPassword.length>=8) {
              checkEmailOnServer(userEmail, (response,error) => {
                  $("#_userSignUpEmail_error").html(response.length > 0 ? "Email Taken. Try Another One." : "").toggle(response.length > 0);
                  if (!response.length > 0){
                    RegisterUserOnServer((response)=>{
                        $("#_userSignUpform").trigger('reset');
                        $('.error-message').hide();
                        $("#_userREgisterDoneSpan").show();    
                        return true      
                    });
                  }
                 return false;
              });
            return true;
          }
          var re=false;
          if(!isValidEmail(userEmail)){
            $("#_userSignUpEmail_error").show().text("Invalid Email Format.");
            re= false;
          }
          if(userPassword.length<8 && userPassword!==""){
            $("#_userSignUpPassword_error").show().text("Password must be at least 8 characters long.");
            re= false;
          }
          if(isValidEmail(userName) && userName!==""){
            $("#_userSignUpName_error").html("Please enter only name. Email Address are not allowed in username field.").show();
          }
          return re;
      },
      login: () => {
          const loginUserEmail = handleFieldValidation($("#_userSignInEmail"), $("#_userSignInEmail_error"), "Email field is required.");
          const loginPassword = handleFieldValidation($("#_userSignInPassword"), $("#_userSignInPassword_error"), "Password field is required.");
          var retur=false;
          if(loginUserEmail !=="" && isValidEmail(loginUserEmail) && loginPassword !== "" && loginPassword.length>=8){
            checkEmailOnServer(loginUserEmail,(response)=>{
                if(response){
                    if(response[0].password===loginPassword){
                        AddLoginActivityOnServer(response[0].a_battle_user_seq,(re)=>{
                            $('#_userLoginForm').trigger('reset');
                            SessionHandler.setSession("IsLoggedIn",true);
                            SessionHandler.setSession("SessionUserSeq",response[0].a_battle_user_seq)
                            SessionHandler.setSession("IsAdmin",response[0].user_type=="BADMIN"?true:false);
                            window.location.href='./index.html';
                        });
                      
                    }else{
                        $("#_userSignInPassword_error").html("Password does not match with this account.").show();
                        return false;
                    }
                }
            })
             retur= true;
          }else{
            if(!isValidEmail(loginUserEmail)){
              $("#_userSignInEmail_error").html("Invalid Email Format.").show();
              retur=false;
            }
            if(loginPassword.length<8 && loginPassword!==""){
              $("#_userSignInPassword_error").html("Should be at least 8 characters long.").show();
              retur=false;
            }
          }
          return retur;
      }
  };

  const clickChangeEvents = (selector, clickHandler) => {
      selector.click((e) => {
          e.preventDefault();
          if (clickHandler && typeof clickHandler === "function") {
              clickHandler();
          }
      });
  };

  const initScriptFeature = (scriptFeature) => {
      const clickHandler = validationScript[scriptFeature == "_userSignIn" ? "login" : "registration"];
      if (!clickHandler || typeof clickHandler !== "function") {
          console.error(`Click handler for ${scriptFeature} not found or not a function`);
          return;
      }
      clickChangeEvents($(`#${scriptFeature}Btn`), () => {
          clickHandler();
      });
      clickChangeEvents($(`#${scriptFeature}Email`), () => {
          const email = $(`#${scriptFeature}Email`).val().trim();
          const password_=$(`#${scriptFeature}Password`).val().trim();
          if (isValidEmail(email)) {
              checkEmailOnServer(email, (response) => {
                  if(scriptFeature==="_userSignIn"){
                      if(response.b_user_email===email){
                        if(response.b_user_password===password_){
                             window.location.href='./index.html';
                        }
                      }
                  }else{
                    console.log(`Email server response for ${scriptFeature}:`, response);
                    $(`#${scriptFeature}Email_error`).html(response.length > 0 ? "Email Taken. Try Another One." : "").toggle(response.length > 0);
                  }
              });
          } else {
              $(`#${scriptFeature}Email_error`).html("Invalid Email Format.").show();
          }
      });

      clickChangeEvents($(`#${scriptFeature}Password`), () => {
          console.log(`Handling password change for ${scriptFeature}`);
      });
      if (scriptFeature === "_userSignUp") {
          clickChangeEvents($(`#${scriptFeature}Btn`), () => {
              // Additional logic for sign up button click
            //   console.log(`Handling click for ${scriptFeature}Btn`);
          });
      }
  };
  const scriptFeatures = ["_userSignIn", "_userSignUp"];
  scriptFeatures.forEach((scriptFeature) => {
      initScriptFeature(scriptFeature);
  });
});