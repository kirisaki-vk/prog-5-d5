import { isExportDeclaration } from "typescript";
import type { Coffee, CoffeeType } from "./CoffeeBusinessManager";

enum MachineStepStatus {
    WAITING_FOR_ORDER,
    COFEE_CHOICE_VALIDATION,
    CHECKING_RESSOURCES,
    HEATING_WATER,
    DISPENSSING_IN_PROGRESS,
    DISPENSSING_VERIFICATION,
    SERVING_COFEE
}

type MachineState  = {
    sugar: number,
    milk: boolean,
    water: boolean,
    availableCoffeeTypes: CoffeeType[],
    cupCount: {
        small: number,
        medium: number,
        large: number
    },
    isPowered: boolean
}

class InvalidCoffeeChoiceException extends Error {}
class MachineNotPoweredException extends Error {}
class MilkUnavailableExecption extends Error {}
class CupUnavailableException extends Error {}
class WaterHeatingException extends Error {}

export class CofeeMachine {
    private stepStatus: MachineStepStatus = MachineStepStatus.WAITING_FOR_ORDER;

    constructor(
        private machineState: MachineState
    ) {}

    public getCurrentStep(): MachineStepStatus {
        return this.stepStatus;
    }

    public async makeCoffee(coffee: Coffee): Promise<Coffee> {
        this.checkPower()
        this.validateCoffeeChoice(coffee)
        return coffee
    }

    private validateCoffeeChoice(coffeeChoice: Coffee)  {
        this.checkPower()
        this.stepStatus = MachineStepStatus.COFEE_CHOICE_VALIDATION;
        if(this.machineState.availableCoffeeTypes.indexOf(coffeeChoice.type) === -1) {
            throw new InvalidCoffeeChoiceException()
        }

        if(coffeeChoice.milk && !(this.machineState.milk)) {
            throw new MilkUnavailableExecption()
        }
        if(coffeeChoice.size && this.machineState.cupCount[coffeeChoice.size] === 0) {
            throw new CupUnavailableException()
        }
    }

    private checkPower() {
        if(!this.machineState.isPowered) 
            throw new MachineNotPoweredException()
    }

    private heatingWater() {
        if(!this.machineState.water) {
            throw new WaterHeatingException()
        }
    }
}