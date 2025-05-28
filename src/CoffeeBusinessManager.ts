import type { CofeeMachine } from "./CoffeeMachine";


interface CoffeeRequest {
    coffee: Coffee;
    payment: Payment;
}

export type CoffeeType = 'espresso' | 'latte' | 'cappuccino' | 'americano';

 export type Coffee = {
    type: CoffeeType;
    size?: "small" | "medium" | "large";
    sugar?: number;
    milk?: boolean;
}

type Payment = {
    amount: number,
    method: PaymentMethod
}

enum PaymentMethod {
    CASH
}

class InsufficientAmountException extends Error {
}

class CoffeeBusinessManager {
    constructor(
        private coffeeMachine: CofeeMachine,
        private coffeePrice: number,
    ) {}

    public async makeRequest(request: CoffeeRequest): Promise<Coffee> {
        this.checkPayment(request);

        return this.makeCoffee(request.coffee);
    }
    
    private checkPayment(request: CoffeeRequest) {
        if(request.payment.amount < this.coffeePrice) {
            throw new InsufficientAmountException()
        }
    }

    private makeCoffee(coffee: Coffee): Promise<Coffee> {
        return this.coffeeMachine.makeCoffee(coffee)
    }
}