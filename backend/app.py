from flask import Flask, request
from Components.buyingOrRenting import buyingOrRenting
from Components.stocks import predict_stock_direction
from Components.buyingOrLeasing import buyingOrLeasing


app = Flask(__name__)

@app.route('/')
def index():
    return "Hello, World!"
@app.route('/getcar', methods=['POST'])
def getcar():
    return "Wow"
@app.route('/api/simulation/buy-rent', methods=['POST'])
def buyOrRentHouse():
    data = request.json
    return buyingOrRenting(data.price, data.downpayment, data.interestrate, data.loan_term, data.monthly_rent, data.length_of_stay)
@app.route('/api/simulation/stock', methods=['POST'])
def stock():
    data = request.json
    predict_stock_direction(data.ticker, data.days)
@app.route('/api/simulation/buy-lease', methods=['POST'] )
def buyOrLeaseCar():
    data = request.json
    return buyingOrLeasing(data.price, data.leaseTerm, data.interest_rate, data.residual_value, data.depreciation_rate)
def getcar():
    return "Wow"
if __name__ == '__main__':
    app.run(debug=True)
