const url = "https://localhost:7053/api/v1/WeatherForecast";//PORT NUMBER MAY CHANGE

let forecast = new Promise((resolve, reject) =>
{
    // "Producing Code" (May take some time)
    fetch(url)
        .then(response =>
        {
            if (!response.ok)
            {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data =>
        {
            resolve(data);
        })
        .catch(error =>
        {
            reject(error);
        });
});

window.onload = () =>
{
    // "Consuming Code" (Must wait for a fulfilled Promise)
    forecast.then((data) =>
    {
        console.log(data);
        generateCard(data);
    })
    .catch((error) =>
    {
        console.error(error);
        document.getElementById("content").innerHTML = error.statusText;
    });
}

function generateCard(data)
{
    let card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${new Date(data.currentDate).toLocaleString( 'en-US', { timeZoneName: 'short' } )}</h5>
            <div>
                ${data.summary}
            </div>
            <div>
                Current temperature: ${data.currentTemperatureF + "&#x2109;"}
            </div>
            ${generateAccordion(data.hourlyForecast)}
        </div>
    `;
    document.getElementById("content").appendChild(card);
}

function generateAccordion(arr)
{
    let accordion = "";

    for(let i = 0; i < arr.length; i++)
    {
        accordion += `
            <div class="accordion accordion-flush" id="accordionFlush${i}">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="flush-heading${i}">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${i}">
                            Weather on ${new Date(arr[i].date).toDateString().toLocaleString( 'en-US', { timeZoneName: 'short' } )}
                        </button>
                    </h2>
                    <div id="flush-collapse${i}" class="accordion-collapse collapse" data-bs-parent="#accordionFlush${i}">
                        <div class="accordion-body">
                            ${getHourlyTemperature(arr[i])}
                        </div> 
                    </div>
                </div>
            </div>
        `;
    }

    return accordion;
}

function getHourlyTemperature(arr)
{
    let hourlyTemperature = [];
    for(let i = 0; i < arr.hourlyTemperatureF.length; i++)
    {
        hourlyTemperature += `${i}:00 | ${arr.hourlyTemperatureF[i]}&#x2109; - ${arr.summary[i]}<br>`
    }
    return hourlyTemperature;
}