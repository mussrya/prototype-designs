var svg = '<div class="text-center loader"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"' +
    ' xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="30px" viewBox="0 0 24 30"' +
    ' style="enable-background:new 0 0 50 50;" xml:space="preserve"><rect x="0" y="0" width="4" height="10" fill="#2196f3"' +
    ' transform="translate(0 3.41582e-7)"><animateTransform attributeType="xml" attributeName="transform" ' +
    'type="translate" values="0 0; 0 20; 0 0" begin="0" dur="0.6s" repeatCount="indefinite"></animateTransform>' +
    '</rect><rect x="10" y="0" width="4" height="10" fill="#2196f3" transform="translate(0 13.3333)">' +
    '<animateTransform attributeType="xml" attributeName="transform" type="translate" ' +
    'values="0 0; 0 20; 0 0" begin="0.2s" dur="0.6s" repeatCount="indefinite"></animateTransform></rect>' +
    '<rect x="20" y="0" width="4" height="10" fill="#2196f3" transform="translate(0 13.3333)">' +
    '<animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0"' +
    ' begin="0.4s" dur="0.6s" repeatCount="indefinite"></animateTransform></rect></svg></div>';

var getData = function ()
{
    var thTarget = document.getElementById('highestHour');
    var tdTarget = document.getElementById('highestDay');
    var lhTarget = document.getElementById('lowestHour');
    var ldTarget = document.getElementById('lowestDay');
    var wTarget = document.getElementById('watchedCurrencies');

    function runner()
    {
        var previousItems = document.getElementsByClassName('smaller');
        while (previousItems[0]) {
            previousItems[0].parentNode.removeChild(previousItems[0]);
        }

        thTarget.insertAdjacentHTML('beforeend', svg);
        tdTarget.insertAdjacentHTML('beforeend', svg);
        lhTarget.insertAdjacentHTML('beforeend', svg);
        ldTarget.insertAdjacentHTML('beforeend', svg);

        axios.get('https://api.coinmarketcap.com/v1/ticker/').then(function (response)
                                                                   {

                                                                       var previousItems = document.getElementsByClassName(
                                                                           'loader');
                                                                       while (previousItems[0]) {
                                                                           previousItems[0].parentNode.removeChild(
                                                                               previousItems[0]);
                                                                       }

                                                                       var formattedData = response.data.map(
                                                                           function (val)
                                                                           {
                                                                               typeof(val.percent_change_1h) === "object" ? 0 : parseFloat(
                                                                                   val.percent_change_1h);
                                                                               typeof(val.percent_change_24h) === "object" ? 0 : parseFloat(
                                                                                   val.percent_change_24h);
                                                                               return val;
                                                                           });

                                                                       var topHour = formattedData.slice().sort(
                                                                           function (a, b)
                                                                           {
                                                                               return b.percent_change_1h - a.percent_change_1h;
                                                                           });

                                                                       var topDay = formattedData.slice().sort(
                                                                           function (a, b)
                                                                           {
                                                                               return b.percent_change_24h - a.percent_change_24h;
                                                                           });

                                                                       var bottomHour = formattedData.slice().sort(
                                                                           function (a, b)
                                                                           {
                                                                               return a.percent_change_1h - b.percent_change_1h;
                                                                           });

                                                                       var bottomDay = formattedData.slice().sort(
                                                                           function (a, b)
                                                                           {
                                                                               return a.percent_change_24h - b.percent_change_24h;
                                                                           });

                                                                       loopResults(
                                                                           [
                                                                               {
                                                                                   data: topHour,
                                                                                   target: thTarget,
                                                                                   type: 0
                                                                               },
                                                                               {
                                                                                   data: topDay,
                                                                                   target: tdTarget,
                                                                                   type: 1
                                                                               },
                                                                               {
                                                                                   data: bottomHour,
                                                                                   target: lhTarget,
                                                                                   type: 0
                                                                               },
                                                                               {
                                                                                   data: bottomDay,
                                                                                   target: ldTarget,
                                                                                   type: 1
                                                                               },
                                                                               {
                                                                                   data: formattedData,
                                                                                   target: wTarget,
                                                                                   type: 3
                                                                               }
                                                                           ]
                                                                       );
                                                                   });
    }

    function loopResults(items)
    {
        items.map(function (item)
                  {
                      var i = 0;
                      item.data.map(function (elem, count)
                                    {
                                        if (parseFloat(elem.price_usd) > 0.5 && i < 5) {
                                            i++;
                                            if (item.type < 3) {
                                                item.target.insertAdjacentHTML('beforeend', outputContent(
                                                    {
                                                        id: elem.id,
                                                        name: elem.name,
                                                        price: elem.price_usd,
                                                        percent: item.type ? elem.percent_change_24h : elem.percent_change_1h
                                                    }
                                                ));
                                            } else {
                                                if (elem.id === 'ethereum' ||
                                                    elem.id === 'dash' ||
                                                    elem.id === 'litecoin' ||
                                                    elem.id === 'ethereum-classic' ||
                                                    elem.id === 'zcash' ||
                                                    elem.id === 'monero') {
                                                    item.target.insertAdjacentHTML('beforeend', outputWatched(
                                                        {
                                                            id: elem.id,
                                                            symbol: elem.symbol,
                                                            name: elem.name,
                                                            price: elem.price_usd,
                                                            percent_change_1h: item.type ? elem.percent_change_1h : elem.percent_change_1h,
                                                            percent_change_24h: item.type ? elem.percent_change_24h : elem.percent_change_24h,
                                                            percent_change_7d: item.type ? elem.percent_change_7d : elem.percent_change_7d
                                                        }
                                                    ));
                                                }
                                            }
                                        } else {
                                            return;
                                        }
                                    });
                  });
    }

    function outputContent(options)
    {
        return '<div class="row">' +
            '<p class="smaller col-5">' +
            '<a target="_blank" class="strongA" href="https://coinmarketcap.com/assets/' + options.id + '">' +
            options.name +
            '</a>' +
            '</p>' +
            '<p class="smaller col-4">$'
            + parseFloat(options.price).toFixed(4) +
            '</p>' +
            '<p class="smaller col-3">' +
            options.percent +
            '%</p>' +
            '</div>';
    }

    function outputWatched(options)
    {
        return '<tr>' +
            '<td class="smaller">' + options.id + '</td>' +
            '<td class="smaller">' + options.symbol + '</td>' +
            '<td class="smaller">' +
            '<a target="_blank" class="strongA" href="https://coinmarketcap.com/assets/' + options.id + '">' +
            options.name +
            '</a>' +
            '</td>' +
            '<td class="smaller">' + options.price + '</td>' +
            '<td class="smaller">' + options.percent_change_1h + '</td>' +
            '<td class="smaller">' + options.percent_change_24h + '</td>' +
            '<td class="smaller">' + options.percent_change_7d + '</td>' +
            '</tr>';
    }

    runner();
    return runner;

}();

setInterval(function () { getData(); }, 200000);