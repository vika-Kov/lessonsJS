var a = 1, b = 1, c, d;
c = ++a; console.log("c="+ c);    // 2//добавляет единицу к переменной (+1)
d = b++; console.log("d="+d);    // 1//изначально переменная d undefined, поэтому ей присваивается значение b=1  
c = (2+ ++a); console.log(c);   // 5// 
d = (2+ b++); 
console.log(d);
console.log(a);
console.log(b);             // 3