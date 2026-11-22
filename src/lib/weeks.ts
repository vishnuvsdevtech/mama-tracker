export const SIZES: Record<number, [string, string]> = {
  4:['a poppy seed','under 2 mm'],5:['a sesame seed','about 2 mm'],6:['a grain of dal','about 6 mm'],
  7:['a blueberry','about 1.3 cm'],8:['a grape','about 1.6 cm'],9:['a cherry','about 2.3 cm'],
  10:['a strawberry','about 3 cm'],11:['a fig','about 4 cm'],12:['a lime','about 5.4 cm'],
  13:['a lemon','about 7.4 cm'],14:['a chikoo','about 8.7 cm'],15:['an apple','about 10 cm'],
  16:['a guava','about 11.6 cm'],17:['a pomegranate','about 13 cm'],18:['a sweet potato','about 14 cm'],
  19:['a mango','about 15 cm'],20:['a nendran banana','around 25 cm, head to heel'],
  21:['a carrot','around 27 cm'],22:['a small papaya','around 28 cm'],23:['a grapefruit','around 29 cm'],
  24:['an ear of corn','around 30 cm'],25:['a cauliflower','around 35 cm'],26:['a bunch of spinach','around 36 cm'],
  27:['a cabbage','around 37 cm'],28:['a brinjal','around 38 cm'],29:['a butternut squash','around 39 cm'],
  30:['a golden cucumber','around 40 cm'],31:['a coconut','around 41 cm'],32:['a big papaya','around 42 cm'],
  33:['a pineapple','around 44 cm'],34:['a muskmelon','around 45 cm'],35:['a honeydew melon','around 46 cm'],
  36:['a small pumpkin','around 47 cm'],37:['an ash gourd','around 49 cm'],38:['a pumpkin','around 50 cm'],
  39:['a watermelon','around 51 cm'],40:['a little jackfruit','around 51 cm'],
}

export function sizeFor(week: number): [string, string] {
  const w = Math.max(4, Math.min(40, Math.round(week)))
  return SIZES[w]
}

export const babyFact = (w: number) =>
  w<=5  ? 'Settling in. A tiny cluster of cells is snuggling into the lining of your womb.' :
  w<=7  ? 'A tiny heart has started its rhythm — often seen on an early scan around now.' :
  w<=10 ? 'Fingers and toes are forming — webbed at first, then slowly separating.' :
  w<=13 ? 'Tiny fingernails are beginning, and little hands can open and close.' :
  w<=16 ? 'Baby can squint, frown and pull little faces. Practice for later!' :
  w<=20 ? 'Flutters! Many mamas feel first movements somewhere between 16 and 25 weeks.' :
  w<=24 ? 'Little ears are working now — your voice is one of the sounds baby is getting to know.' :
  w<=28 ? 'Eyelids are beginning to open, and baby can sense light through your bump.' :
  w<=32 ? 'Practising breathing movements and filling out with soft baby fat.' :
  w<=36 ? 'Bones are firming up while the skull stays soft for the journey out. Many babies turn head-down.' :
          'Any day now. From 37 weeks, baby is considered early term — getting ready to meet you.'

export const mamaFact = (w: number) =>
  w<=13 ? 'Tiredness and queasiness are common in these weeks. Resting counts as doing something.' :
  w<=27 ? 'Energy often comes back in the middle months, and your bump starts saying hello to the world.' :
  w<=34 ? 'Feeling a little breathless or noticing practice tightenings is common now. Slow is fine.' :
          'Bag-packing season. Keep your doctor\'s number and your hospital papers somewhere easy.'

export const trimester = (w: number) => (w <= 13 ? 1 : w <= 27 ? 2 : 3)

/** Months as most families count them, mapped to weeks. */
export const MONTHS = [
  { m: 1, from: 1,  to: 4,  mid: 3 },
  { m: 2, from: 5,  to: 8,  mid: 7 },
  { m: 3, from: 9,  to: 13, mid: 11 },
  { m: 4, from: 14, to: 17, mid: 16 },
  { m: 5, from: 18, to: 22, mid: 20 },
  { m: 6, from: 23, to: 27, mid: 25 },
  { m: 7, from: 28, to: 31, mid: 30 },
  { m: 8, from: 32, to: 35, mid: 34 },
  { m: 9, from: 36, to: 40, mid: 38 },
]
