import random
def investment_status(investment_amount, type, returnperc):
    if(type == 'food'):
        random_int = random_int(1,3)
    elif(type == 'business'):
        random_int = random_int(1,5)
    else:
        random_int = random_int(1,10)
    final = investment_amount*(1+returnperc/100)
    if random_int == 2:
        return {"Message": f"Uh-Oh, your investment did not work out and you ended up losing ${investment_amount} dollars. Better luck next time!"}
    return {"Message": f"Yay! Your investment worked out and you ended up gaining ${final} dollars. Better luck next time!"}

    
    
    