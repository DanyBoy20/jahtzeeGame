/** Regla para el puntaje de Yahtzee
 *
 * Esta es una clase abstracta, las reglas reales son subclases de esta.
 * Almacenara todos los parametros pasados en esta como propiedades de la instancia.
 * ( para simplificar las clases hijas, para que asi no necesiten su propio constructor )
 * 
 * Contiene funciones utiles para sumar, contar valores y contar la frecuencia de los dados.
 * Estas son usadas por las reglas de la subclase.
 */

class Rule {
  constructor(params) {
    // poner todas las propiedades dentro de parametros de la instancia
    // copia un objeto a otro, en este caso, al objeto que crea el constructor y la fuente es el objeto pasado por parametros
    Object.assign(this, params);
  }

  sum(dice) {
    // suma todos los dados
    return dice.reduce((prev, curr) => prev + curr);
  }

  freq(dice) {
    // frecuencia de los valores de los dados, por ejemplo: [ 3, 2, 3, 3, 3] devolveria: [4, 1], es decir: (4 veces 3, 1 vez 2)
    const freqs = new Map();
    for (let d of dice) freqs.set(d, (freqs.get(d) || 0) + 1);
    return Array.from(freqs.values());
  }

  count(dice, val) {
    // numero de veces que el valor aparece en el dado
    return dice.filter(d => d === val).length;
  }
}

/**
 * Dado un valor buscado, retorna la suma de los dados de ese valor, por ejemplo: const sixes = new TotalOneNumber({ val: 6 });
 * regresa el valor de 6 (this.val) X (cuenta(las veces que salio el valor de 6 "this.val" en el arreglo "dice"))
 * es decir, en este ejemplo, cuantas veces salio el 6 const sixes = new TotalOneNumber({ val: 6 }) en el arreglo Dice */
class TotalOneNumber extends Rule {
  evalRoll = dice => {
    return this.val * this.count(dice, this.val);
  };
}

/**
 * Dado un numero requerido de los mismos dados, regresa la suma de todos los dados
 */
class SumDistro extends Rule {
  evalRoll = dice => {
    // do any of the counts meet of exceed this distro?
    return this.freq(dice).some(c => c >= this.count) ? this.sum(dice) : 0;
  };
}

/**
 * Verificar si es fullhouse (3 de un tipo y 2 de otro tipo) ejemplo: [ 1, 3, 3, 3, 1]
 */
class FullHouse extends Rule {
  evalRoll = dice => {
    const freqs = this.freq(dice);
    return freqs.includes(2) && freqs.includes(3) ? this.score : 0;
  };
}

/**
 * Verificar por lineas 
 */
class SmallStraight extends Rule {
  evalRoll = dice => {
    const d = new Set(dice);
    // una linea puede ser 234 + 1 o 5
    if (d.has(2) && d.has(3) && d.has(4) && (d.has(1) || d.has(5)))
      return this.score;

    // puede ser 345 + 2 o 6
    if (d.has(3) && d.has(4) && d.has(5) && (d.has(2) || d.has(6)))
      return this.score;

    return 0;
  };
}

/**
 * Verificar por lineas grandes
 */
class LargeStraight extends Rule {
  evalRoll = dice => {
    const d = new Set(dice);
    // lineas largas son de 5 dados distintos y solo pueden ser de 1 a 5
    // si el arreglo dice tiene 5 elementos y no tiene repetidos, entonces es una linea larga
    return d.size === 5 && (!d.has(1) || !d.has(6)) ? this.score : 0;
  };
}

/**
 * Verificar si todos los dados son los mismos
 */
class Yahtzee extends Rule {
  evalRoll = dice => {
    // todos los dados deben ser iguales
    return this.freq(dice)[0] === 5 ? this.score : 0;
  };
}

// puntuacion de unos, dos, etcetera como suma de ese valor
const ones = new TotalOneNumber({ 
  val: 1, 
  description: "1 point per 1" 
});
const twos = new TotalOneNumber({ 
  val: 2, 
  description: "2 points per 2" 
});
const threes = new TotalOneNumber({ 
  val: 3, 
  description: "3 points per 3" 
});
const fours = new TotalOneNumber({ 
  val: 4, 
  description: "4 points per 4" 
});
const fives = new TotalOneNumber({ 
  val: 5, 
  description: "5 points per 5" 
});
const sixes = new TotalOneNumber({ 
  val: 6, 
  description: "6 points per 6" 
});

// puntuacion de tipo tres/cuatro como suma de todos los dados
const threeOfKind = new SumDistro({
  count: 3,
  description: "Sum all dice if 3 are the same"
});
const fourOfKind = new SumDistro({
  count: 4,
  description: "Sum all dice if 4 are the same"
});

// puntuacion fullhouse como 25
const fullHouse = new FullHouse({
  score: 25,
  description: "25 points for a full house"
});

// puntuacion de lineas pequeñas/grandes como 30/4
const smallStraight = new SmallStraight({
  score: 30,
  description: "30 points for a small straight"
});
const largeStraight = new LargeStraight({
  score: 40,
  description: "40 points for a large straight"
});

// Puntuacion Yahtzee como 50
const yahtzee = new Yahtzee({
  score: 50,
  description: "50 points for yahtzee"
});

// como oportunidad, poder ver parte de todos los dados, requiriendo al menos o de un tipo
const chance = new SumDistro({ count: 0, description: "Sum of all dice" });

export {
  ones,
  twos,
  threes,
  fours,
  fives,
  sixes,
  threeOfKind,
  fourOfKind,
  fullHouse,
  smallStraight,
  largeStraight,
  yahtzee,
  chance
};
