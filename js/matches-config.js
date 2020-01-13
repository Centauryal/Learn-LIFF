const base_url = "https://api.football-data.org/v2/";
const standings_url = "competitions/";
const API_KEY = "3901c72a75b24e7c97fc5210ecf7eaef";

const fetchApi = function(url) {
  return fetch(url, {
    mode: "cors",
    headers: {
      "X-Auth-Token": API_KEY
    }
  });
};

function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}

function json(response) {
  return response.json();
}

function error(error) {
  console.log("Error : " + error);
}

async function getMatches(leagueId, dateNow, dateTo) {
  let response = await fetchApi(
    base_url +
      standings_url +
      leagueId +
      "/matches?dateFrom=" +
      dateNow +
      "&dateTo=" +
      dateTo +
      "&status=SCHEDULED"
  )
    .then(status)
    .then(json)
    .catch(error);

  return response;
}

async function loadMatches(leagueId) {
  let elmMatches = document.getElementById("body-content");
  if (typeof elmMatches != "undefined" && elmMatches != null) {
    let elmTitle = document.getElementById("title-match");
    let html = "";
    let matchLeague = {};

    switch (leagueId) {
      case 2021:
        elmTitle.innerHTML = `
          <p>Premier League</p>
          `;
        break;
      case 2014:
        elmTitle.innerHTML = `
          <p>LaLiga Santander</p>
          `;
        break;
      case 2002:
        elmTitle.innerHTML = `
          <p>Bundesliga</p>
          `;
        break;
      case 2003:
        elmTitle.innerHTML = `
          <p>Eredivisie</p>
          `;
        break;
      case 2015:
        elmTitle.innerHTML = `
          <p>Ligue 1</p>
          `;
        break;
    }

    let pad = n => {
      return n < 10 ? "0" + n : n;
    };

    let today = new Date();
    let day1 = today.getDate();
    let month1 = today.getMonth() + 1;
    let year1 = today.getFullYear();
    let dateNow = year1 + "-" + pad(month1) + "-" + pad(day1);

    let nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);
    let day2 = nextMonth.getDate();
    let month2 = nextMonth.getMonth() + 1;
    let year2 = nextMonth.getFullYear();
    let dateTo = year2 + "-" + pad(month2) + "-" + pad(day2);

    matchLeague = await getMatches(leagueId, dateNow, dateTo);
    matchLeague.matches.forEach(function(match) {
      home = match.homeTeam.name;
      away = match.awayTeam.name;
      html += `
        <div class="col-md-6">
         <div class="panel panel-match panel-default">
            <div class="panel-body card-match" onclick="sendMatches(home, away)">
                <span>
                    <p class="name-match truncate">
                        ${home}<br>
                        vs<br>
                        ${away}<br>
                    </p>
                    <p class="time-match">
                        ${new Date(match.utcDate).toString().substring(0, 21)}
                    </p>
                </span>
            </div>
         </div>
        </div>
        `;
    });

    elmMatches.innerHTML = html;
  }
}

function sendMatches(home, away) {
  if (!liff.isInClient()) {
    sendAlertIfNotInClient();
  } else {
    liff
      .sendMessages([
        {
          type: "text",
          text: home + "" + "vs" + "" + away
        }
      ])
      .then(function() {
        alert("Schedule has been sent");
      })
      .catch(function(e) {
        alert("Error schedule");
      });
  }
}

$(".dropdown-menu li a").click(function() {
  $(this)
    .parents(".dropdown")
    .find(".btn")
    .html($(this).text() + ' <span class="caret"></span>');
  $(this)
    .parents(".dropdown")
    .find(".btn")
    .val($(this).data("value"));
});
