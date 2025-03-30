def buyingOrRenting(
    price,
    downpayment_percent,
    interestrate,
    loan_term,
    monthly_rent,
    length_of_stay,
    annual_appreciation=0.03,
    property_tax_rate=0.012,
    maintenance_rate=0.01,
    annual_insurance=1200,
    investment_return=0.06
):
    # 1. Upfront Costs
    downpayment = price * (downpayment_percent / 100)
    closing_costs = price * 0.02  # Example: 2% closing costs
    upfront_costs = downpayment + closing_costs

    # 2. Monthly Mortgage Payment
    loan_amount = price - downpayment
    monthly_interest_rate = interestrate / 100 / 12
    total_payments = loan_term * 12
    monthly_mortgage = loan_amount * (monthly_interest_rate * (1 + monthly_interest_rate) ** total_payments) / ((1 + monthly_interest_rate) ** total_payments - 1)

    # 3. Total Costs for Buying
    mortgage_paid = monthly_mortgage * 12 * length_of_stay
    property_value_after_stay = price * (1 + annual_appreciation) ** length_of_stay
    property_taxes = property_value_after_stay * property_tax_rate * length_of_stay
    maintenance_costs = price * maintenance_rate * length_of_stay
    insurance_costs = annual_insurance * length_of_stay
    total_buying_costs = upfront_costs + mortgage_paid + property_taxes + maintenance_costs + insurance_costs

    # 4. Equity for Buying
    payments_made = length_of_stay * 12
    remaining_loan_balance = loan_amount * ((1 + monthly_interest_rate) ** total_payments - (1 + monthly_interest_rate) ** payments_made) / ((1 + monthly_interest_rate) ** total_payments - 1)
    equity_after_stay = property_value_after_stay - remaining_loan_balance

    # 5. Total Costs for Renting
    total_rent_paid = monthly_rent * 12 * length_of_stay
    savings_growth = downpayment * (1 + investment_return) ** length_of_stay
    net_savings_from_renting = savings_growth - total_rent_paid

    # 6. Net Worth Comparison
    buying_net_worth = equity_after_stay
    renting_net_worth = net_savings_from_renting

    # 7. Output Results
    return {
        "buying": {
            "monthlyMortgage": round(monthly_mortgage, 2),
            "upfrontCosts": round(upfront_costs, 2),
            "propertyValueAfterStay": round(property_value_after_stay, 2),
            "ongoingCosts": {
                "propertyTaxes": round(property_taxes, 2),
                "maintenanceCosts": round(maintenance_costs, 2),
                "insuranceCosts": round(insurance_costs, 2)
            },
            "totalCostsAfterStay": round(total_buying_costs, 2),
            "equityAfterStay": round(equity_after_stay, 2)
        },
        "renting": {
            "totalRentPaid": round(total_rent_paid, 2),
            "savingsGrowth": round(savings_growth, 2),
            "netSavingsFromRenting": round(net_savings_from_renting, 2)
        },
        "comparison": {
            "buyingNetWorth": round(buying_net_worth, 2),
            "rentingNetWorth": round(renting_net_worth, 2),
            "recommendation": "Renting provides better flexibility and savings for short-term stays."
            if renting_net_worth > buying_net_worth
            else "Buying offers better long-term investment value."
        }
    }