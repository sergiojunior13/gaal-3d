export class Matrix {
    values: number[][];
    n_rows: number;
    n_cols: number;

    is_reduced: boolean = false;
    solution: (number | undefined)[] = [];
    solution_type: "unique" | "infinite-solutions" | "no-solution" | null = null;

    constructor(values: number[][], is_reduced?: boolean) {
        this.values = values;
        this.n_rows = values.length;

        if (is_reduced !== undefined) this.is_reduced = is_reduced;

        // Caso os array-coluna não tenham tamanhos diferentes, fazer que todos tenham o mesmo tamanho, os preenchendo com 0's.
        const biggest_col_array_size = values.reduce((max_size, crr_col) => Math.max(max_size, crr_col.length), 0);

        // Preenche com 0's
        values.forEach((col, index) => {
            const crr_col_size = col.length;

            if (crr_col_size < biggest_col_array_size) {
                values[index].length = biggest_col_array_size;
                values[index].fill(0, crr_col_size, biggest_col_array_size);
            }
        });

        this.n_cols = biggest_col_array_size;
    }

    // Caso for um número muito próximo de zero, tratar como se fosse zero
    private isNumberReallyNearZero(n: number) {
        return Math.abs(n) < 1e-10;
    }

    // Comparar os números da coluna correspondente à linha. Traz a linha que tem o maior valor absoluto na coluna para o topo
    private pivotPartial(row_index: number, col_index: number) {
        // Comparar os números da coluna e pega a linha que possui o maior número absoluto
        let max_row_index = row_index;
        let max_row_value = Math.abs(this.values[row_index][col_index]);

        for (let crr_row_index = row_index + 1; crr_row_index < this.n_rows; crr_row_index++) {
            const crr_row_value = Math.abs(this.values[crr_row_index][col_index]);

            if (crr_row_value > max_row_value) {
                max_row_value = crr_row_value;
                max_row_index = crr_row_index;
            }
        }

        // Traz a linha com o maior valor absoluto para cima
        this.switchRows(row_index, max_row_index);
    }

    private reduceRow(row: number, solution: (number | undefined)[]) {
        // Representa o lado direito da equação linear
        let constant = this.values[row][this.n_cols - 1];

        let n_variables_undefined = 0;

        // Essa variável só é usada quando a linha só possui uma variável indefinida, para se descobrir o seu valor
        let index_of_unique_variable_with_no_solution = -1;

        // Percorre todas as colunas das variáveis
        for (let j = 0; j < this.n_cols - 1; j++) {
            const i_j_coefficient = this.values[row][j];

            // Se o coeficiente for zero, ignora essa variável
            if (this.isNumberReallyNearZero(i_j_coefficient)) continue;

            const j_variable = solution[j];

            // Indica que ainda não se sabe o valor da variável
            if (j_variable === undefined) {
                n_variables_undefined++;
                index_of_unique_variable_with_no_solution = j;

                // Pula para a próxima coluna/variável
                continue;
            }

            // Se a variável já possui um valor, multiplica-a pelo seu coeficiente e a joga para o lado da constante
            constant -= i_j_coefficient * j_variable;
        }

        return {
            n_variables_undefined,
            index_of_unique_variable_with_no_solution,
            constant,
        };
    }

    solve() {
        // Desconsiderando a última coluna
        const solution = new Array<number | undefined>(this.n_cols - 1);
        this.solution_type = "unique"; // Assume-se que tem solução única até que se prove o contrário

        if (!this.is_reduced) this.reduceUsingGaussElimination();

        // Percorre as linhas de baixo para cima
        for (let i = this.n_rows - 1; i >= 0; i--) {
            let { n_variables_undefined, index_of_unique_variable_with_no_solution, constant } = this.reduceRow(
                i,
                solution,
            );

            if (n_variables_undefined === 0) {
                // Se a linha for toda composta de zeros, ou seja, b = 0, simplesmente a ignora
                if (this.isNumberReallyNearZero(constant)) continue;

                // Se a linha for algo como [0 0 0 ... | b], b != 0, o sistema não possui solução.
                this.solution_type = "no-solution";
                return;
            }

            if (n_variables_undefined === 1) {
                const coefficient_of_unique_variable = this.values[i][index_of_unique_variable_with_no_solution];

                // Isola a única variável que sobrou na linha
                const solution_of_unique_variable = constant / coefficient_of_unique_variable;
                solution[index_of_unique_variable_with_no_solution] = solution_of_unique_variable;

                if (this.isNumberReallyNearZero(solution_of_unique_variable)) {
                    solution[index_of_unique_variable_with_no_solution] = 0;
                }

                continue;
            }

            if (n_variables_undefined > 1) this.solution_type = "infinite-solutions";
        }

        // Se faltou resolver alguma variável, a matriz tem infinitas soluções
        if (solution.includes(undefined)) {
            this.solution_type = "infinite-solutions";
        }

        this.solution = solution;
        return solution;
    }

    reduceUsingGaussElimination() {
        let row = 0,
            col = 0;

        let canReduce = true;
        while (canReduce) {
            if (row === this.n_rows || col === this.n_cols) {
                canReduce = false;
                break;
            }

            // Faz o pivoteamento parcial
            this.pivotPartial(row, col);

            /* Se o elemento atual (crr_row, crr_col), que é o maior da coluna atual (pelo pivoteamento),
            ainda é zero, pular pra próxima coluna, mas na mesma linha */
            if (this.isNumberReallyNearZero(this.values[row][col])) {
                col++;
                continue;
            }

            // Zerar os elementos abaixo do pivô
            const pivot = this.values[row][col];
            for (let i = row + 1; i < this.n_rows; i++) {
                const multiplier = this.values[i][col] / pivot;

                // Faz a seguinte operação na linha: L_i <-- L_i - multiplier*L_row
                for (let j = col; j < this.n_cols; j++) {
                    this.values[i][j] = this.values[i][j] - multiplier * this.values[row][j];
                    if (this.isNumberReallyNearZero(this.values[i][j])) this.values[i][j] = 0;
                }
            }

            row++;
            col++;
        }

        this.is_reduced = true;
    }

    getRow(index: number): number[] {
        const row = this.values[index];
        if (!row) throw new Error(`Linha ${index} não existe.`);
        return row;
    }

    getColumn(index: number): number[] {
        if (this.values.length === 0) return [];

        return this.values.map((row) => {
            if (index >= row.length) throw new Error(`Coluna ${index} não existe.`);

            return row[index];
        });
    }

    getPivot(row_index: number) {
        const row = this.getRow(row_index);

        for (let i = 0; i < this.n_cols; i++) {
            if (Math.abs(row[i]) !== 0) return { value: row[i], index: i };
        }

        // Caso a linha não possua pivô, ou seja, seja uma linha composta por somente zeros
        return null;
    }

    switchRows(row_1_index: number, row_2_index: number) {
        if (row_1_index === row_2_index) return;

        const temp = this.values[row_1_index];
        this.values[row_1_index] = this.values[row_2_index];
        this.values[row_2_index] = temp;
    }
}
