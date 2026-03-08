// a_1x + a_2y + a_3z + .... = b
export class LinearEquation {
    coefficients: number[]; // a_1, a_2, a_3...
    constant: number; // b

    constructor(coefficients: number[], constant: number) {
        this.coefficients = coefficients;
        this.constant = constant;
    }

    sum(linear_equation: LinearEquation) {
        // Soma os respectivos coeficientes de cada equação
        linear_equation.coefficients.forEach((eq2_coefficient, i) => {
            this.coefficients[i] += eq2_coefficient;
        });

        // Soma os dois termos independentes
        this.constant += linear_equation.constant;
    }
}
