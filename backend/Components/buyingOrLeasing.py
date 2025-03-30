def buyingOrLeasing(
    purchase_price,
    lease_term_months,
    interest_rate,
    residual_value,  # Percentage of the purchase price as residual value
    depreciation_rate,
    investment_return=0.06
):
    # 1. Residual Value
    residual_value = residual_value

    # 2. Monthly Lease Payment
    monthly_interest_rate = interest_rate / 100 / 12
    depreciation_cost = (purchase_price - residual_value) / lease_term_months
    interest_component = (purchase_price + residual_value) * monthly_interest_rate
    lease_monthly_payment = depreciation_cost + interest_component

    # 3. Buying the Car with Cash
    # Depreciation after lease term
    depreciation_loss = purchase_price * depreciation_rate
    resale_value_after_term = purchase_price - depreciation_loss

    # Opportunity cost (if money was invested instead of spent on the car)
    opportunity_cost = purchase_price * ((1 + investment_return) ** (lease_term_months / 12) - 1)

    # Total cost for buying after lease term
    total_cost_buying = depreciation_loss + opportunity_cost

    # 4. Leasing the Car
    # Total lease payments
    total_lease_payments = lease_monthly_payment * lease_term_months

    # Residual value (optional purchase)
    total_cost_leasing_with_buyout = total_lease_payments + residual_value

    # 5. Comparison Results
    return {
        "buying": {
            "initialCost": round(purchase_price, 2),
            "depreciationLoss": round(depreciation_loss, 2),
            "opportunityCost": round(opportunity_cost, 2),
            "totalCostAfterTerm": round(total_cost_buying, 2),
            "resaleValueAfterTerm": round(resale_value_after_term, 2),
        },
        "leasing": {
            "monthlyLeasePayment": round(lease_monthly_payment, 2),
            "totalLeasePayments": round(total_lease_payments, 2),
            "residualValue": round(residual_value, 2),
            "totalCostWithBuyout": round(total_cost_leasing_with_buyout, 2),
            "flexibility": "You can return the car or buy it after the lease term."
        },
        "comparison": {
            "recommendation": "Leasing is more cost-effective for short-term flexibility."
            if total_lease_payments < total_cost_buying
            else "Buying offers better long-term value if you keep the car."
        }
    }
