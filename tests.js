// Ізольовані модульні перевірки (Unit Assertions) на базі console.assert()

function runUnitTests() {
  // 1. Перевірка валідного значення стану
  console.assert(
    isValidState('content') === true && isValidState('loading') === true,
    'FAIL: Валідні назви станів мають повертати true'
  );

  // 2. Перевірка порожнього рядка та рядка з пробілами
  console.assert(
    isValidState('') === false && isValidState('   ') === false,
    'FAIL: Порожній рядок або пробіли мають повертати false'
  );

  // 3. Перевірка неіснуючого стану та некоректного типу даних
  console.assert(
    isValidState('unknown_state') === false && isValidState(null) === false && isValidState(123) === false,
    'FAIL: Неіснуючий стан або не-рядок мають повертати false'
  );

  // 4. Перевірка чистої функції фільтрації масиву (штатний та порожній запит)
  const sample = [
    { id: 1, title: 'Midnight City', genre: 'Synthwave' },
    { id: 2, title: 'Cyber Dreams', genre: 'Darksynth' }
  ];
  console.assert(
    filterTracksList(sample, 'cyber').length === 1,
    'FAIL: Фільтрація за підрядком має знайти 1 елемент'
  );
  console.assert(
    filterTracksList(sample, '   ').length === 2,
    'FAIL: Пошук із самими пробілами має повертати весь початковий список'
  );

  console.info('✅ Unit-тести успішно пройдені (0 помилок Assertion failed).');
}

window.addEventListener('DOMContentLoaded', runUnitTests);