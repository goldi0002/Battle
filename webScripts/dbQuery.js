const x_apiKey="ecb0a57d75b59abad5cfada533387290b88c6";
const x_registerDetailApiKey="65901813733e2c4c47decae8";
const supabase_key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0YmRocXdhZnZtaGF1Y3ZrZndhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM5OTc0NzQsImV4cCI6MjAxOTU3MzQ3NH0.fuLEZWkK5vj9AJaClHEF3V-9wiAN7WbIJsXugKDUc18";
const ajaxRequest = (url, method, data, successCallback, errorCallback, key) => {
    const settings = {
        url,
        method,
        headers: {
          "content-type": "application/json",
          'apikey': supabase_key,
        },
        data: JSON.stringify(data)
    };
    $.ajax(settings).done(successCallback).fail(errorCallback);
};