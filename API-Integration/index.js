const url = "https://localhost:7053/api/v1/WeatherForecast";//PORT NUMBER MAY CHANGE

$( document ).ready(function() 
{
    getForecast();
});

function getForecast()
{
    let myPromise = new Promise(function(success, reject) 
    {
        // "Producing Code" (May take some time)
        $.getJSON(url, function(data) 
        {
            success(data);
        })
        .fail(function(error) 
        {
            reject(error);
        });
    });
    
    // "Consuming Code" (Must wait for a fulfilled Promise)
    myPromise.then(
        function(data) //Code if success
        { 
            console.log(data);
            //generateCard(new Date(data[0].date).toLocaleString( 'sv', { timeZoneName: 'short' } ));//Test

            generateCard(data); 
        },
        function(error) //Code if failure
        { 
            console.error(error);
            document.getElementById("content").innerHTML = error.statusText;
        }
    );
}

function generateCard(data)
{
    let card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${new Date(data.currentDate).toLocaleString( 'sv', { timeZoneName: 'short' } )}</h5>
            <div>
                ${data.summary}
            </div>
            <div>
                Current temperature: ${data.currentTemperatureF + "&#x2109;"}
            </div>
            ${generateAccordian(data.hourlyForecast)}
        </div>
    `;
    document.getElementById("content").appendChild(card);
}

function generateAccordian(arr)
{
    let accordian = "";

    for(let i = 0; i < arr.length; i++)
    {
        const randId = getRandomInt(99999999);
        accordian += `
            <div class="accordion accordion-flush" id="accordionFlushExample">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="flush-heading${randId}">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${randId}" aria-expanded="false" aria-controls="flush-collapse${randId}">
                            Weather on ${new Date(arr[i].date).toDateString().toLocaleString( 'sv', { timeZoneName: 'short' } )}
                        </button>
                    </h2>
                    <div id="flush-collapse${randId}" class="accordion-collapse collapse" aria-labelledby="flush-heading${randId}" data-bs-parent="#accordionFlushExample">
                        <div class="accordion-body">
        `;

        for(let j = 0; j < arr[i].hourlyTemperatureF.length; j++)
        {
            accordian += `${j}:00 | ${arr[i].hourlyTemperatureF[j]}&#x2109; - ${arr[i].summary[j]}<br>`
        }

        accordian += `
                        </div> 
                    </div>
                </div>
            </div>
        `;
    }

    return accordian;
}

function getRandomInt(max) 
{
    return Math.floor(Math.random() * max);
}