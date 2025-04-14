function addCells() {
    let grid=document.getElementById("sudoku");
    for (let row=0;row<81;row++) {
            let element=document.createElement("input");
            element.type="text";
            element.className="cell";
            element.oninput = restrictInput;
            element.maxLength=1;
            element.placeholder=" ";
            element.inputMode="numeric";
            grid?.appendChild(element);
    }
}
addCells();
var cells=document.querySelectorAll('.cell');
function restrictInput(event) {
    event.target.value = event.target.value.replace(/[^1-9]/g, '');
    if (event.target.value=="" && event.target.style.backgroundColor!="grey")
        event.target.style.backgroundColor="grey"
}
function isValidSudoku(grid) {
    function isValidGroup(group) {
        let seen = new Set();
        for (let num of group) {
            if (num !== 0 && seen.has(num)) return false;
            seen.add(num);
        }
        return true;
    }
    for (let row = 0; row < 9; row++) {
        if (!isValidGroup(grid[row])) return false;
    }
    for (let col = 0; col < 9; col++) {
        let column = [];
        for (let row = 0; row < 9; row++) {
            column.push(grid[row][col]);
        }
        if (!isValidGroup(column)) return false;
    }
    for (let boxRow = 0; boxRow < 3; boxRow++) {
        for (let boxCol = 0; boxCol < 3; boxCol++) {
            let subgrid = [];
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    subgrid.push(grid[boxRow * 3 + row][boxCol * 3 + col]);
                }
            }
            if (!isValidGroup(subgrid)) return false;
        }
    }
    return true;
}
function isSafe(mat,row,col,num) {
    let i;
    for (i=0;i<9;i++) {
        if (mat[i][col]==num)
            return false;
    }
    for (i=0;i<9;i++) {
        if (mat[row][i]==num)
            return false;
    }
    let startRow=row-row%3;
    let startCol=col-col%3;
    for (i=0;i<3;i++) {
        for (let j=0;j<3;j++) {
            if (mat[i+startRow][j+startCol]==num){
                return false;
            }
        }
    }
    return true;
}
function print(mat) {
    let index=0;
    for (let i=0;i<9;i++) {
        for (let j=0;j<9;j++) {
            if (cells[index].value.length==0)
                cells[index].style.backgroundColor="green";
            cells[index++].value=mat[i][j];
        }
    }
    return true;
}
function solve(mat,row,col) {
    if (row==8 && col==9) {
        return true;
    }
    if (col==9) {
        row++;
        col=0;
    }
    if (mat[row][col]!=0)
        return solve(mat,row,col+1);
    for (let num=1;num<=9;num++) {
        if (isSafe(mat,row,col,num)){
            mat[row][col]=num;
            if (solve(mat,row,col+1))
                return true;
            mat[row][col]=0;
        }
    }
    return false;
}
function isEmpty(val) {
    if (val.length=0) {
        return 0;
    }
    return Number(val);
}
function clear() {
    if (confirm('Are you sure that you want to clear your Sudoku grid?')){
        cells.forEach((element) => {
            element.value=""
            element.style.backgroundColor="grey"
        })
    }
}
function init() {
    var matrix=[]
    var row=[]
    cells.forEach((element)=>{
        if (row.length<9) {
            row.push(isEmpty(element.value));
        } else {
            matrix.push(row)
            row=[];
            row.push(isEmpty(element.value));
        }
    });
    if (row.length > 0) {
        matrix.push(row);
    }
    if (isValidSudoku(matrix)) {
        if (solve(matrix,0,0))
            print(matrix);  
        else
            alert('error solving');
    }
    else
        alert('There is no solution')
}
const rowSize = 9;
function move(event, index) {
    switch (event.key) {
        case "ArrowRight":
            if ((index + 1) % rowSize !== 0) {
                index = index + 1;
            }
            break;
        case "ArrowLeft":
            if (index % rowSize !== 0) {
                index = index - 1;
            }
            break;
        case "ArrowDown":
            if (index + rowSize < cells.length) {
                index = index + rowSize;
            }
            break;
        case "ArrowUp":
            if (index - rowSize >= 0) {
                index = index - rowSize;
            }
            break;
    }
    cells[index].focus();
}
cells.forEach(cell => {
    cell.addEventListener("keydown", function(event) {
        move(event, Array.from(cells).indexOf(this));
    });
});
document.getElementById('clear')?.addEventListener("click",clear)
document.getElementById("solve")?.addEventListener("click",init);
