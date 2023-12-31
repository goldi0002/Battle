$(document).ready(()=>{
    var IsLoggedIn=SessionHandler.getSession("IsLoggedIn");
    if(IsLoggedIn==null){
      window.location.href='./Login.html'
    }
    const getFaqFromServer = (successCallback,errorCallback) => {
        const url = `https://ytbdhqwafvmhaucvkfwa.supabase.co/rest/v1/a_battle_faqs`;
        ajaxRequest(url, "GET", null, successCallback, errorCallback);
    };  
    getFaqFromServer((response,error)=>{
            if(response){
                var _faqContainer='';
                debugger;
                for(var i=0;i<response.length;i++){
                    _faqContainer += `
                    <div class="question-container">
                        <span class="question-text heading4" id="${response[i].faq_seq}">
                            <span>${response[i].Question}</span>
                        </span>
                        <span class="question-text1">
                            <span>${response[i].Answer}</span>
                        </span>
                    </div>`;
                }
                $('#Faq_SectionIndex').html(_faqContainer);
            }
    });
});