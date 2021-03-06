from stocks.models import Sector, Currency, Exchange, Stock, Company, Tag

def upload_initial_data():
    """
    uploads initial data for canadian companies only
    """
    data = {"updated":1512866292573,"data":[[["DAY %","PPS (CAD)","TKR","NAME","SECTOR","EX.","ALT. TKR","VOL","VOL @ CRNT $","MC ($MM)"],["5.84%","1.45","ABCN","ABcann Medicinals","BioTech","CVE","ABCCF","901,940","1,307,813","78.49"],["6.14%","7.09","ACB","Aurora Cannabis","Cultivation & Retail","TSE","ACBFF","13,927,205","98,743,883.45","2,861.53"],["9.09%","0.24","ACG","Alliance Growers ","AgTech","CNSX","--","1,189,385","285,452.4",""],["0.00%","0.10","AFI","Affinor Growers","AgTech","CNSX","RSSFF","210,310","21,031",""],["3.22%","13.47","APH","Aphria","Cultivation & Retail","TSE","APHQF","2,663,133","35,872,401.51","2,042.08"],["13.95%","0.25","ATT","Abattis Bio","BioTech","CNSX","ATTBF","2,706,357","676,589.25","39.86"],["0.00%","2.03","BE","Beleave","Cultivation & Retail","CNSX","BLEVF","597,909","1,213,755.27",""],["1.28%","1.58","BLO","Cannabix Tech","LawTech","CNSX","BLOZF","465,869","736,073.02","136.61"],["-2.20%","0.89","CBW","Cannabis Wheaton ","Investing & Finance","CVE","KWFLF","815,477","725,774.53","234.57"],["-0.65%","19.93","CMED","Cannimed","Cultivation & Retail","TSE","CMMDF","130,722","2,605,289.46","457.69"],["12.73%","0.62","CMM","Canabo Medical","MedCare","CVE","CAMDF","330,404","204,850.48","23.54"],["-2.87%","2.71","CRZ","Cannaroyalty","Investing & Finance","CNSX","CNNRF","961,449","2,605,526.79","115.09"],["-6.67%","0.28","CYX","Calyx Bio","AgTech","CVE","CLYXF","2,120,562","593,757.36","24.23"],["0.00%","1.23","DOJA","DOJA Cannabis","Cultivation & Retail","CNSX","DJACF","206,635","254,161.05","72.27"],["-4.40%","0.44","DVA","Delivra","BioTech","CVE","--","89,485","39,373.4","19.55"],["6.52%","0.25","EAT","Nutritional High","Marijuana Edibles & Extracts","CNSX","SPLIF","3,067,636","766,909","61.54"],["-1.20%","1.64","EMC","Emblem","Cultivation & Retail","CVE","EMMBF","411,764","675,292.96","130.60"],["2.05%","3.98","EMH","Emerald","Cultivation & Retail","CVE","TBQBF","1,430,067","5,691,666.66","374.34"],["-5.88%","0.48","FFT","Future Farm Tech","AgTech","CNSX","AGSTF","1,291,240","619,795.2","0.61"],["1.06%","1.90","FIRE","Supreme Pharma","Cultivation & Retail","CVE","SPRWF","1,275,906","2,424,221.4","391.96"],["5.26%","0.10","GHG","Global Hemp","Cultivation & Retail","CNSX","GBHPF","764,350","76,435",""],["3.28%","0.31","GLH","Golden Leaf","Marijuana Products","CNSX","GLDFF","4,298,567","1,332,555.77","116.96"],["-1.96%","0.50","HC","High Hampton Holdings","Investing & Finance","CNSX","--","727,116","363,558",""],["1.89%","0.54","HIP","Newstirke Resources ","Cultivation & Retail","CVE","NWKRF","431,875","233,212.5","210.35"],["8.91%","1.10","HVST","Harvest One Cannabis","Cultivation & Retail","CVE","HRVOF","2,192,877","2,412,164.7","98.10"],["8.89%","0.98","ICC","International Cannabis","Cultivation & Retail","CVE","ICCLF","123,538","121,067.24","110.84"],["0.00%","1.62","IMH","Invictus MD","Investing & Finance","CVE","IVITF","781,924","1,266,716.88","129.87"],["12.50%","0.90","IN","Inmed Pharma","BioTech","CNSX","IMLFF","3,846,586","3,461,927.4",""],["2.27%","1.80","ISOL","Isodiol International ","Hemp Products","CNSX","LAGBF","8,514,952","15,326,913.6",""],["7.84%","0.28","KALY","Kalytera Therapeutics","BioTech","CVE","QUEZD","5,634,186","1,577,572.08","34.74"],["-1.72%","0.57","LDS","Lifestyle Delivery Systems","BioTech","CNSX","LDSYF","685,628","390,807.96","51.44"],["0.19%","15.50","LEAF","MedReleaf Corp","Cultivation & Retail","TSE","MEDFF","229,190","3,552,445","1,459.18"],["2.33%","0.44","LIB","Liberty Leaf Holdings","Investing & Finance","CNSX","LIBFF","4,555,082","2,004,236.08",""],["10.42%","1.59","LXX","Lexaria Bio","Hemp Products","CNSX","LXRP","1,523,338","2,422,107.42",""],["-1.38%","2.14","MARI","Maricann Group","Cultivation & Retail","CNSX","MRRCF","678,106","1,451,146.84","157.10"],["3.26%","0.95","MDM","Marapharm","Cultivation & Retail","CNSX","MRPHF","209,019","198,568.05",""],["0.00%","0.57","MGW","Maple Leaf Green World","Cultivation & Retail","CVE","MGWFF","367,479","209,463.03","83.83"],["7.37%","1.02","MJ","True Leaf","Hemp Pet Chews","CNSX","TLFMF","164,101","167,383.02",""],["2.27%","4.50","MJN","Pharmacan /Cronos","Investing & Finance","CVE","PRMCF","419,922","1,889,649","675.43"],["4.23%","2.71","MYM","My Marijuana","Cultivation & Retail","CNSX","--","1,066,122","2,889,190.62",""],["4.40%","0.95","N","Namaste Tech","Consumption Devices","CNSX","NXTTF","5,714,764","5,429,025.8","192.50"],["0.00%","0.10","NF","New Age Farm","Hemp Products","CNSX","NWGFF","3,938,476","393,847.6",""],["-7.27%","0.25","NSP","Naturally Splendid","Hemp Products","CVE","NSPDF","484,812","121,203","24.42"],["4.99%","3.79","OGI","Organigram","Cultivation & Retail","CVE","OGRMF","3,654,843","13,851,854.97","375.89"],["1.15%","0.88","PUF","PUF Ventures","Consumption Devices","CNSX","PUFXF","719,534","633,189.92","45.85"],["10.68%","1.14","RHT","Reliq Health Tech","Mobile Software","CVE","RQHTF","1,564,567","1,783,606.38","98.74"],["4.05%","1.80","RTI","Radient Technologies","Extraction","CVE","RDDTF","2,181,473","3,926,651.4","345.53"],["3.64%","0.28","RVV","Revive Therapeutics","Medication","CVE","RVVTF","399,705","111,917.4","15.50"],["-2.90%","0.67","SUN","Wildflower","Hemp Products","CNSX","WLDFF","87,197","58,421.99","29.48"],["-0.67%","4.45","SXP","Supremex","Packaging","TSE","SUMXF","27,015","120,216.75","126.40"],["0.00%","0.76","TBP","Tetra Bio-Pharma","BioTech","CVE","GRPOF","497,745","378,286.2","88.67"],["2.44%","2.10","TER","TerrAscend Corp","Cultivation & Retail","CNSX","--","270,176","567,369.6",""],["4.29%","0.73","THC","THC Biomed","BioTech","CNSX","THCBF","818,162","597,258.26","81.29"],["3.55%","3.21","THCX","Hydropothecary Corp","Cultivation & Retail","CVE","HYYDF","1,581,640","5,077,064.4","282.37"],["8.22%","0.79","TNY","Tinley Beverage Co","Beverage","CNSX","QRSRF","945,154","746,671.66","57.81"],["3.49%","7.70","TRST","CannTrust","Cultivation & Biotech","CNSX","CNTTF","368,892","2,840,468.4","699.98"],["-8.04%","1.03","VGW","Valens Groworks","BioTech","CNSX","MYMSF","23,285","23,983.55","62.77"],["0.00%","0.52","VIN","Vinergy Resources","Investing & Finance","CNSX","VNNYF","0","",""],["-2.50%","0.39","VP","Vodis Pharma","Cultivation & Retail","CNSX","VDQSF","52,661","20,537.79",""],["6.67%","0.80","VRT","Veritas Pharma","BioTech","CNSX","VRTHF","377,901","302,320.8",""],["6.41%","19.42","WEED","Canopy Growth","Cultivation & Retail","TSE","TWMJF","4,940,034","95,935,460.28","3,706.63"],["6.25%","2.38","WMD","WeedMD","Cultivation & Retail","CVE","WDDMF","1,174,148","2,794,472.24","124.71"],["3.36%","14.75","HMMJ","Horizons Marijuana Life Sciences","Canadian Marijuana ETF","TSE","HMLSF","336,579","4,964,540.25","197.64"]]],"sheetnames":["ALLSHOW"]}
    
    exchange_suffixes = {'TSE': 'TO', 'CVE': 'V'}

    # create sector
    sector, _ = Sector.objects.get_or_create(name="Cannabis", slug='cannabis')

    # create currency
    currency, _ = Currency.objects.get_or_create(symbol='CAD', defaults={'character':'$', 'name':'Canadian Dollar'})
    us_currency, _ = Currency.objects.get_or_create(symbol='USD', defaults={'character':'$', 'name':'US Dollar'})

    # OTC exchange
    otc, _ = Exchange.objects.get_or_create(symbol='OTC', defaults={'name':'OTC', 'currency': us_currency})

    # iterate over each item in our table, make the items
    for row in data["data"][0][1:]:
        # percent = float(row[0].replace("%",""))
        suffix = exchange_suffixes[row[5]] if row[5] in exchange_suffixes else ''
        exchange, _ = Exchange.objects.get_or_create(symbol=row[5], defaults={'name':row[5], 'currency':currency, 'ticker_suffix': suffix})
        company, _ = Company.objects.get_or_create(name=row[3], defaults={'sector':sector})
        stock, _ = Stock.objects.get_or_create(ticker=row[2], defaults={
            'company': company,
            'exchange': exchange,
            'market_cap': float(row[9].replace(",","")) * 1000000 if row[9] else 0.0,
            # 'previous_close': float(row[1]) - float(row[1]) * percent / 100,
            # 'open': float(row[1]),
            # 'current': float(row[1]),
            # 'volume': float(row[8].replace(",","")) if row[8] else 0.0,
        })
        stock.save()

        if row[4]:
            tag, _ = Tag.objects.get_or_create(name=row[4])
            company.tags.add(tag)

        if row[6] and not row[6] == "--":
            stock, _ = Stock.objects.get_or_create(ticker=row[6], defaults={'company':company, 'exchange':otc})


    print data