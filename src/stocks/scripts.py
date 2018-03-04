import json
from pprint import pprint

from stocks.models import Sector, Currency, Exchange, Stock, Company, Tag

def upload_initial_data():
    """
    takes in json file and uploads initial data
    """
    data = json.load(open('stocks/data/3-4-2018.json'))
    exchange_suffixes = {'TSE': 'TO', 'CVE': 'V'}

    # create sector
    sector, _ = Sector.objects.get_or_create(name="Cannabis", slug='cannabis')

    # create currency
    currency, _ = Currency.objects.get_or_create(
        symbol='CAD', defaults={'character':'$', 'name':'Canadian Dollar'})
    us_currency, _ = Currency.objects.get_or_create(
        symbol='USD', defaults={'character':'$', 'name':'US Dollar'})

    # create american exchanges
    otc, _ = Exchange.objects.get_or_create(
        symbol='OTC', defaults={'name':'OTC', 'currency': us_currency})
    nasdaq, _ = Exchange.objects.get_or_create(
        symbol='NASDAQ', defaults={'name':'NASDAQ', 'currency': us_currency})

    # iterate over each item, add the stock
    for row in data:
        suffix = ''
        if row["EX"] in exchange_suffixes:
            suffix = exchange_suffixes[row["EX"]]

        exchange, _ = Exchange.objects.get_or_create(
            symbol=row["EX"], defaults={'name':row["EX"],
                                        'currency':currency,
                                        'ticker_suffix': suffix})
        company, _ = Company.objects.get_or_create(
            name=row["NAME"], defaults={'sector':sector})
        market_cap = 0
        if row["MC ($MM)"]:
            market_cap = float(row["MC ($MM)"].replace("$","").replace("M","").replace(",","")) * 1000000
        stock, _ = Stock.objects.get_or_create(ticker=row["TKR"], defaults={
            'company': company,
            'exchange': exchange,
            'market_cap': market_cap,
        })
        stock.save()

        if row["SECTOR"]:
            tag, _ = Tag.objects.get_or_create(name=row["SECTOR"])
            company.tags.add(tag)

        if row["ALT. TKR"] and not row["ALT. TKR"] == "--":
            stock, _ = Stock.objects.get_or_create(
                ticker=row["ALT. TKR"],
                defaults={'company':company, 'exchange':otc, 'market_cap': market_cap})

    # TRADINGVIEW MODIFICATIONS
    # rename some and deactivate some
    Exchange.objects.filter(symbol="TSE").update(symbol="TSX", name="TSX")
    Exchange.objects.filter(symbol="CVE").update(symbol="TSXV", name="TSXV")
    Exchange.objects.filter(symbol__in=["CNSX"]).update(is_active=False)
    print data
    