import { useState, useEffect, useRef } from 'react';

const sections = [
  { id: 'overview', title: '🚂 Обзор', icon: '🚂' },
  { id: 'gameplay-loop', title: '🔄 Игровой цикл', icon: '🔄' },
  { id: 'mechanics', title: '⚙️ Механики', icon: '⚙️' },
  { id: 'trains', title: '🚃 Поезда и депо', icon: '🚃' },
  { id: 'enemies', title: '💀 Нападения', icon: '💀' },
  { id: 'casino', title: '🎰 Казино', icon: '🎰' },
  { id: 'progression', title: '📈 Прогрессия', icon: '📈' },
  { id: 'levels', title: '🗺️ Уровни', icon: '🗺️' },
  { id: 'physics', title: '💥 Физика', icon: '💥' },
  { id: 'tech', title: '🔧 Техника', icon: '🔧' },
  { id: 'assets', title: '📦 Ассеты', icon: '📦' },
  { id: 'timeline', title: '📅 План', icon: '📅' },
];

function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const content = contentRef.current;
      if (!content) return;
      const sectionElements = sections.map(s => document.getElementById(s.id));
      const scrollTop = content.scrollTop;
      
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && el.offsetTop - 100 <= scrollTop) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener('scroll', handleScroll);
      return () => content.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el && contentRef.current) {
      contentRef.current.scrollTo({ top: el.offsetTop - 20, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-orange-600 p-2 rounded-lg shadow-lg"
      >
        <span className="text-xl">{mobileMenuOpen ? '✕' : '☰'}</span>
      </button>

      {/* Sidebar */}
      <nav className={`
        fixed lg:static inset-y-0 left-0 z-40 w-72 bg-gray-900 border-r border-gray-800
        transform transition-transform duration-300 overflow-y-auto
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-orange-400">🚂 Rail Mayhem</h1>
          <p className="text-sm text-gray-400 mt-1">Depot to Depot — GDD v1.0</p>
          <div className="mt-3 flex gap-2 flex-wrap">
            <span className="px-2 py-0.5 bg-red-900/50 text-red-300 text-xs rounded">UE5</span>
            <span className="px-2 py-0.5 bg-blue-900/50 text-blue-300 text-xs rounded">Co-op 4P</span>
            <span className="px-2 py-0.5 bg-green-900/50 text-green-300 text-xs rounded">PC/Steam</span>
          </div>
        </div>
        <ul className="p-4 space-y-1">
          {sections.map(section => (
            <li key={section.id}>
              <button
                onClick={() => scrollToSection(section.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
                  activeSection === section.id
                    ? 'bg-orange-600/20 text-orange-300 border-l-2 border-orange-500'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                {section.title}
              </button>
            </li>
          ))}
        </ul>
        <div className="p-4 border-t border-gray-800 mt-4">
          <p className="text-xs text-gray-500">
            «Если поезд летит с моста — это не баг, это фича»
          </p>
        </div>
      </nav>

      {/* Main content */}
      <main ref={contentRef} className="flex-1 overflow-y-auto scroll-smooth">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-16">
          {/* Hero */}
          <section className="text-center py-12 border-b border-gray-800">
            <div className="text-6xl mb-4">🚂💥🎰</div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400">
              RAIL MAYHEM
            </h1>
            <h2 className="text-2xl text-gray-300 mt-2">Depot to Depot</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto italic">
              «Кооперативный хаос на рельсах, где каждый вагон — это ставка в казино, 
              а каждый поворот — шанс улететь в стратосферу»
            </p>
            <div className="mt-6 flex justify-center gap-4 flex-wrap">
              <div className="px-4 py-2 bg-gray-800 rounded-lg">
                <div className="text-orange-400 font-bold">20-40 мин</div>
                <div className="text-xs text-gray-400">сессия</div>
              </div>
              <div className="px-4 py-2 bg-gray-800 rounded-lg">
                <div className="text-orange-400 font-bold">1-4 игрока</div>
                <div className="text-xs text-gray-400">кооператив</div>
              </div>
              <div className="px-4 py-2 bg-gray-800 rounded-lg">
                <div className="text-orange-400 font-bold">PS1-style</div>
                <div className="text-xs text-gray-400">low-poly графон</div>
              </div>
              <div className="px-4 py-2 bg-gray-800 rounded-lg">
                <div className="text-orange-400 font-bold">Chaos Physics</div>
                <div className="text-xs text-gray-400">полёты гарантированы</div>
              </div>
            </div>
          </section>

          {/* Overview */}
          <Section id="overview" title="🚂 Обзор проекта">
            <p className="text-lg text-gray-300 leading-relaxed">
              <strong className="text-orange-400">Rail Mayhem: Depot to Depot</strong> — это кооперативный экшен/tower defense, 
              где команда из 1-4 игроков управляет поездом, движущимся из депо А в депо Б. 
              Задача простая на словах: довезти пассажиров живыми, отбиться от нападения и не отправить 
              состав в свободный полёт с моста.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <InfoCard title="🎮 Жанр" content="Кооперативный экшен + Tower Defense + Физический симулятор + Абсурд" />
              <InfoCard title="🎨 Визуал" content="Low-poly 3D, кривые текстуры, PS1/PS2 эстетика + современное освещение и физика" />
              <InfoCard title="🎯 Целевая аудитория" content="Фанаты коопа (Lethal Company, Content Warning), любители абсурда (Goat Sim, Repo)" />
              <InfoCard title="💰 Монетизация" content="Premium (Steam), DLC с новыми маршрутами и поездами" />
            </div>

            <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
              <h4 className="text-yellow-400 font-bold mb-2">⚠️ Ключевая философия дизайна</h4>
              <p className="text-gray-300 text-sm">
                Каждый момент игры должен быть либо смешным, либо напряжённым, либо и тем, и другим одновременно. 
                Если поезд стоит на месте — это провал дизайна. Поезд ВСЕГДА движется, 
                и ВСЕГДА что-то идёт не по плану. Птеродактиль утащил вагон? Смешно. 
                Машинист перепутал тормоз с газом на мосту? Мем на неделю. 
                Казино сожрало все монеты перед боссом? Трагикомедия.
              </p>
            </div>

            <h3 className="text-xl font-bold text-orange-300 mt-8 mb-4">Референсы вдохновения</h3>
            <div className="grid md:grid-cols-3 gap-3">
              <RefCard game="Lethal Company" why="Кооперативный хаос, процедурный контент" />
              <RefCard game="Train Sim World" why="Реалистичные поезда (но мы их ломаем)" />
              <RefCard game="Hold to Fish" why="Казино-механика, абсурдный юмор" />
              <RefCard game="Totally Accurate Battle Sim" why="Физический хаос, ragdoll" />
              <RefCard game="Teardown" why="Разрушаемое окружение" />
              <RefCard game="SnowRunner" why="Физика транспорта в экстремальных условиях" />
            </div>
          </Section>

          {/* Gameplay Loop */}
          <Section id="gameplay-loop" title="🔄 Игровой цикл">
            <h3 className="text-xl font-bold text-orange-300 mb-4">Структура сессии (20-40 минут)</h3>
            
            <div className="space-y-4">
              <PhaseCard
                phase="Фаза 1: Подготовка в депо (2-3 мин)"
                color="blue"
                items={[
                  'Выбор маршрута из 3 вариантов (разная сложность, биом, награды)',
                  'Покупка патронов, ремонтных наборов, апгрейдов',
                  'Посещение казино (опционально — можно спустить всё или сорвать джекпот)',
                  'Распределение ролей: машинист, стрелок, ремонтник, защитник',
                  'Загрузка пассажиров (NPC садятся в вагоны, анимация как в метро в час пик)',
                ]}
              />
              <PhaseCard
                phase="Фаза 2: Маршрут — Акт 1 «Без пушки» (5-10 мин)"
                color="yellow"
                items={[
                  'Поезд движется, машинист управляет скоростью и стрелками',
                  'Враги: бандиты на дрезинах, препятствия на путях, животные',
                  'Защита: уклонение, ремонт, замедление/ускорение',
                  'Напряжение растёт: мосты, тоннели, крутые повороты',
                  'Кульминация акта: поезд въезжает в «Зону Оружия» — катсцена установки пушки',
                ]}
              />
              <PhaseCard
                phase="Фаза 3: Маршрут — Акт 2 «Пушка!» (8-15 мин)"
                color="orange"
                items={[
                  'Открывается стрельба из огромной пушки на платформе',
                  'Враги: птеродактили, дроны-камикадзе, бронедрезины',
                  'Стрелок наводится, машинист маневрирует, ремонтник чинит',
                  'Случайные события: обвал, туман, аномалия (гравитация меняется)',
                  'Казино-событие: можно поставить на то, выживет ли вагон №3',
                ]}
              />
              <PhaseCard
                phase="Фаза 4: Маршрут — Акт 3 «Босс» (5-10 мин)"
                color="red"
                items={[
                  'Босс маршрута: гигантский мех-бандит, КРАКЕН на путях, или аномальный поезд-призрак',
                  'Все системы на пределе: пушка перегревается, вагоны отваливаются',
                  'Финальный рывок до депо Б',
                  'Катсцена прибытия (если доехали) или падения с обрыва (если нет)',
                ]}
              />
              <PhaseCard
                phase="Фаза 5: Результаты (2-3 мин)"
                color="green"
                items={[
                  'Подсчёт: спасённые пассажиры × множчик + бонусы',
                  'Монеты начисляются, рейтинг (S/A/B/C/D — где D = «поезд стал арт-объектом»)',
                  'Разблокировки, скины, новые поезда',
                  'Возврат в депо — новый цикл',
                ]}
              />
            </div>

            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <h4 className="text-orange-400 font-bold mb-2">📊 Баланс сессии</h4>
              <div className="grid grid-cols-5 gap-2 text-center text-sm">
                <div className="bg-blue-900/30 p-2 rounded">
                  <div className="text-blue-300 font-bold">10%</div>
                  <div className="text-xs text-gray-400">Подготовка</div>
                </div>
                <div className="bg-yellow-900/30 p-2 rounded">
                  <div className="text-yellow-300 font-bold">25%</div>
                  <div className="text-xs text-gray-400">Акт 1</div>
                </div>
                <div className="bg-orange-900/30 p-2 rounded">
                  <div className="text-orange-300 font-bold">40%</div>
                  <div className="text-xs text-gray-400">Акт 2</div>
                </div>
                <div className="bg-red-900/30 p-2 rounded">
                  <div className="text-red-300 font-bold">20%</div>
                  <div className="text-xs text-gray-400">Акт 3</div>
                </div>
                <div className="bg-green-900/30 p-2 rounded">
                  <div className="text-green-300 font-bold">5%</div>
                  <div className="text-xs text-gray-400">Итоги</div>
                </div>
              </div>
            </div>
          </Section>

          {/* Mechanics */}
          <Section id="mechanics" title="⚙️ Ключевые механики">
            <h3 className="text-xl font-bold text-orange-300 mb-4">Роли игроков</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <RoleCard
                role="🚂 Машинист"
                description="Управляет locomotive. Скорость, торможение, стрелки, гудок (для мемов)."
                controls={[
                  'W/S — газ/тормоз (0-120 км/ч)',
                  'A/D — стрелки (переключение путей)',
                  'Space — экстренный тормоз (риск схода с рельсов!)',
                  'E — гудок (пугает птиц, бесит пассажиров)',
                  'Q — сцепка/отцепка вагонов',
                ]}
                ue5="Blueprint: BP_TrainController. Input: Enhanced Input System. Speed curve: FloatCurve с физическим ограничением."
              />
              <RoleCard
                role="🔫 Стрелок"
                description="Крутит пушку, наводится, стреляет. Может случайно попасть в свой вагон."
                controls={[
                  'Мышь — наведение (от первого/третьего лица)',
                  'ЛКМ — выстрел (перезарядка 3-8 сек)',
                  'Р — смена типа снаряда (осколочный/зажигательный/ракета)',
                  'F — ремонт пушки (если заело)',
                ]}
                ue5="Blueprint: BP_TurretController. Weapon system: наследник от BP_WeaponBase. Projectile: физический снаряд с Chaos Physics."
              />
              <RoleCard
                role="🔧 Ремонтник"
                description="Бегает по вагонам, чинит повреждения, тушит пожары, спасает пассажиров."
                controls={[
                  'ЛКМ на повреждение — ремонт (прогресс-бар 2-5 сек)',
                  'E — взаимодействие (поднять пассажира, открыть дверь)',
                  'F — огнетушитель (ограниченный заряд)',
                  'Tab — карта повреждений поезда',
                ]}
                ue5="Blueprint: BP_RepairSystem. Damage model: массив структур FTrainCarDamage с HP, fire chance, structural integrity."
              />
              <RoleCard
                role="🛡️ Защитник"
                description="Отбивает абордажников в ближнем бою внутри вагонов. Ломает стулья об головы врагов."
                controls={[
                  'ЛКМ — удар (ближний бой)',
                  'ПКМ — блок',
                  'Space — отбрасывание (с физикой ragdoll)',
                  'E — подобрать оружие врага (одноразовое)',
                ]}
                ue5="Blueprint: BP_MeleeCombat. Physics: Chaos Physics для ragdoll врагов. Knockback: AddImpulse() с рандомным направлением."
              />
            </div>

            <h3 className="text-xl font-bold text-orange-300 mt-8 mb-4">Система управления поездом</h3>
            <div className="p-4 bg-gray-800 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-orange-400">
                    <th className="pb-2">Параметр</th>
                    <th className="pb-2">Значение</th>
                    <th className="pb-2">Примечание</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-t border-gray-700">
                    <td className="py-2">Макс. скорость</td>
                    <td>120 км/ч (33.3 м/с)</td>
                    <td>Для грузовых — 80 км/ч</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="py-2">Ускорение</td>
                    <td>0.8 м/с²</td>
                    <td>Зависит от локомотива</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="py-2">Торможение</td>
                    <td>2.5 м/с² (обычное)</td>
                    <td>Экстренное: 5 м/с² + риск схода</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="py-2">Мин. радиус поворота</td>
                    <td>50 м</td>
                    <td>На скорости &gt;60 км/ч — риск схода</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="py-2">Длина состава</td>
                    <td>4-8 вагонов</td>
                    <td>+ локомотив</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="py-2">Масса вагона</td>
                    <td>40-60 тонн</td>
                    <td>Влияет на инерцию при сходе</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="py-2">Прочность вагона</td>
                    <td>1000 HP</td>
                    <td>Локомотив: 2000 HP</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-purple-900/20 border border-purple-700/50 rounded-lg">
              <h4 className="text-purple-400 font-bold mb-2">🎭 Система «Случайных Абсурдных Событий» (R.A.E.)</h4>
              <p className="text-gray-300 text-sm mb-3">
                Каждые 30-60 секунд рандомайзер может запустить одно из событий:
              </p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• 🐄 <strong>Корова на путях</strong> — поезд тормозит или переезжает (корову жалко, но...) </li>
                <li>• 🌪️ <strong>Аномальный вихрь</strong> — гравитация на 5 сек меняется, вагоны летят</li>
                <li>• 🎵 <strong>Баян из ниоткуда</strong> — все враги замедляются на 3 сек (пасхалка)</li>
                <li>• 🚽 <strong>Туалетная авария</strong> — один вагон «отравлен», пассажиры бегут в другие</li>
                <li>• 👻 <strong>Поезд-призрак</strong> — встречный поезд без машиниста, нужно уклониться</li>
                <li>• 🎪 <strong>Цирк на рельсах</strong> — клоуны кидают бомбы-шары, нужно лопнуть</li>
              </ul>
            </div>
          </Section>

          {/* Trains */}
          <Section id="trains" title="🚃 Поезда и депо">
            <h3 className="text-xl font-bold text-orange-300 mb-4">Локомотивы (реальные прототипы)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <TrainCard
                name="ВЛ80 «Владимир Ленин»"
                type="Электровоз"
                stats={{ speed: 110, hp: 2500, accel: 0.7, price: 0 }}
                desc="Тяжёлый, надёжный, как танк. Медленно разгоняется, но держит удар. Стартовый локомотив."
                unlock="Доступен сразу"
              />
              <TrainCard
                name="ТЭП70 «Тепловоз»"
                type="Тепловоз"
                stats={{ speed: 120, hp: 1800, accel: 1.0, price: 5000 }}
                desc="Быстрый, но хрупкий. Идеален для пустынных маршрутов без контактной сети."
                unlock="5000 монет"
              />
              <TrainCard
                name="ЧС2 «Чехословак»"
                type="Электровоз"
                stats={{ speed: 130, hp: 2000, accel: 0.9, price: 8000 }}
                desc="Красивый, быстрый, с характером. Иногда «капризничает» (случайные поломки)."
                unlock="Пройти 5 маршрутов"
              />
              <TrainCard
                name="ЭР2 «Электричка»"
                type="Электропоезд"
                stats={{ speed: 100, hp: 1200, accel: 1.2, price: 3000 }}
                desc="Быстрый разгон, но мало HP. Вагоны уже, но их можно прицепить до 10 штук."
                unlock="3000 монет"
              />
              <TrainCard
                name="2ТЭ10М «Тепловоз-Мастер»"
                type="Тепловоз (секция)"
                stats={{ speed: 100, hp: 3500, accel: 0.5, price: 12000 }}
                desc="ДВЕ секции! Двойная тяга, двойная масса. Может тащить 8+ вагонов в гору."
                unlock="12000 монет + S-ранг на «Сибирь»"
              />
              <TrainCard
                name="???: «Аномальный Локомотив»"
                type="???"
                stats={{ speed: 200, hp: 5000, accel: 2.0, price: '???' }}
                desc="Секретный локомотив. Находит в аномальных зонах. Может телепортироваться. Гудок играет «Катюшу»."
                unlock="Найти 3 аномалии на всех маршрутах"
              />
            </div>

            <h3 className="text-xl font-bold text-orange-300 mt-8 mb-4">Типы вагонов</h3>
            <div className="grid md:grid-cols-3 gap-3">
              <WagonCard emoji="🪑" name="Пассажирский" hp={1000} capacity={40} desc="Сидят NPC. Теряешь пассажиров — теряешь деньги." />
              <WagonCard emoji="📦" name="Грузовой" hp={1500} capacity={0} desc="Блок. Нет пассажиров, но даёт бонус к массе (меньше сносит)." />
              <WagonCard emoji="🔫" name="Платформа с пушкой" hp={800} capacity={0} desc="Активируется во 2-м акте. Стрелок крутит пушку." />
              <WagonCard emoji="🎰" name="Вагон-казино" hp={600} capacity={10} desc="Мини-игры, ставки. Мало HP — рискованно!" />
              <WagonCard emoji="🛡️" name="Бронированный" hp={2500} capacity={20} desc="Дорогой, тяжёлый, но держит удар. Замедляет разгон." />
              <WagonCard emoji="🔧" name="Мастерская" hp={900} capacity={5} desc="Автоматически ремонтирует соседние вагоны (+5 HP/сек)." />
            </div>

            <h3 className="text-xl font-bold text-orange-300 mt-8 mb-4">Депо (Хабы)</h3>
            <div className="space-y-3">
              <DepotCard name="Депо «Москва-Сортировочная»" desc="Стартовое депо. Всё есть, всё доступно. Тут учат нажимать тормоз ДО моста." />
              <DepotCard name="Депо «Тайга-3»" desc="Промежуточное. Мало товаров, но можно найти редкие апгрейды у местных «умельцев»." />
              <DepotCard name="Депо «Пустынь»" desc="Жаркое депо в пустыне. Казино тут щедрее, но цены в 2 раза выше." />
              <DepotCard name="Депо «Аномальное»" desc="Финальное депо. Гравитация работает через раз. Торговец — призрак." />
            </div>
          </Section>

          {/* Enemies */}
          <Section id="enemies" title="💀 Система нападений">
            <h3 className="text-xl font-bold text-orange-300 mb-4">Враги и волны</h3>
            <div className="space-y-4">
              <EnemyCard
                name="🏍️ Бандиты на дрезинах"
                act={1}
                hp={200}
                damage={50}
                desc="Ездят рядом с поездом, кидают коктейли Молотова и пытаются запрыгнуть."
                behavior="Спавнятся группами по 2-4 штуки. Движутся параллельно поезду. Приближаются на 10м — прыгают."
              />
              <EnemyCard
                name="🦅 Птеродактили"
                act={2}
                hp={300}
                damage={80}
                desc="Летают над поездом, пикируют и хватают пассажиров из открытых окон."
                behavior="Летают кругами, пикируют каждые 5-8 сек. Попадание пушкой = ragdoll + падение."
              />
              <EnemyCard
                name="🤖 Дроны-камикадзе"
                act={2}
                hp={100}
                damage={150}
                desc="Маленькие, быстрые, взрываются при контакте. Прилетают стаями."
                behavior="Спавн волнами по 5-10 штук. Летят по прямой к поезду. Взрыв = 150 урона + поджог."
              />
              <EnemyCard
                name="🧗 Абордажники"
                act={2}
                hp={400}
                damage={30}
                desc="Запрыгивают на крышу, ломают люки, спускаются внутрь. Бьют ломом."
                behavior="Лезут на крышу, 3 сек ломают люк, спускаются. В вагоне бьют пассажиров и оборудование."
              />
              <EnemyCard
                name="🚂 Поезд-камикадзе"
                act={3}
                hp={5000}
                damage={9999}
                desc="Безпилотный состав, летящий навстречу. Нужно свернуть на другой путь!"
                behavior="Появляется за 15 сек. Машинист должен переключить стрелку. Если не успел — КРИТИЧЕСКИЙ урон."
              />
              <EnemyCard
                name="👹 БОСС: Мех-Барон"
                act={3}
                hp={20000}
                damage={200}
                desc="Гигантский робот на рельсах. Стреляет ракетами, кидает вагоны, орёт матом."
                behavior="3 фазы. Фаза 1: ракеты. Фаза 2: кидает обломки. Фаза 3: ускорение + берсерк."
              />
            </div>

            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <h4 className="text-orange-400 font-bold mb-3">📊 Кривая сложности</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm w-20 text-gray-400">0-5 мин</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-4">
                    <div className="bg-green-500 h-4 rounded-full" style={{width: '20%'}}></div>
                  </div>
                  <span className="text-xs text-gray-400">Легко</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm w-20 text-gray-400">5-15 мин</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-4">
                    <div className="bg-yellow-500 h-4 rounded-full" style={{width: '50%'}}></div>
                  </div>
                  <span className="text-xs text-gray-400">Средне</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm w-20 text-gray-400">15-25 мин</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-4">
                    <div className="bg-orange-500 h-4 rounded-full" style={{width: '75%'}}></div>
                  </div>
                  <span className="text-xs text-gray-400">Сложно</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm w-20 text-gray-400">25-40 мин</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-4">
                    <div className="bg-red-500 h-4 rounded-full" style={{width: '100%'}}></div>
                  </div>
                  <span className="text-xs text-gray-400">ХАΟΣ</span>
                </div>
              </div>
            </div>
          </Section>

          {/* Casino */}
          <Section id="casino" title="🎰 Система казино">
            <p className="text-gray-300 mb-4">
              Казино — это сердце абсурда в Rail Mayhem. Оно доступно в депо (основное казино) 
              и в специальном вагоне-казино во время маршрута. Баланс построен так, чтобы 
              казино было <strong className="text-yellow-400">заманчивым, но не обязательным</strong> — 
              можно пройти игру без единой ставки.
            </p>

            <h3 className="text-xl font-bold text-orange-300 mb-4">Мини-игры казино</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <CasinoGame
                name="🎰 Слоты «Три Семерки»"
                cost="100/500/1000 монет"
                desc="Три барабана с символами поездов. 3 одинаковых = джекпот."
                odds="Шанс джекпота: 2%. Малый выигрыш: 30%. Проигрыш: 68%."
                rewards="Джекпот: ×50. Малый: ×2. Проигрыш: −ставка."
              />
              <CasinoGame
                name="🎡 Рулетка «Колесо Фортуны»"
                cost="200/1000 монет"
                desc="Крутим колесо. Сектора: ×0, ×1.5, ×3, ×10, БОНУС, ДЕБАФФ."
                odds="×0: 35%. ×1.5: 25%. ×3: 20%. ×10: 5%. БОНУС: 10%. ДЕБАФФ: 5%."
                rewards="БОНУС: бесплатный ремонт. ДЕБАФФ: −20% к скорости на 1 маршрут."
              />
              <CasinoGame
                name="🫳 Напёрстки «Где Вагон?»"
                cost="300 монет"
                desc="Три вагона, под одним — приз. Угадываешь — забираешь. Нет — теряешь."
                odds="Шанс угадать: 33%. Но после первого проигрыша — 25% (жульничаем)."
                rewards="Приз: случайный апгрейд или ×3 монет."
              />
              <CasinoGame
                name="🎲 «Ставка на Вагон»"
                cost="500 монет"
                desc="Ставишь на конкретный вагон: переживёт ли он следующую волну?"
                odds="Если вагон выжил — ×3. Если отцепился/сгорел — ставка потеряна."
                rewards="Можно ставить только в вагоне-казино ВО ВРЕМЯ маршрута. Риск/награда!"
              />
            </div>

            <div className="mt-6 p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
              <h4 className="text-green-400 font-bold mb-2">⚖️ Система анти-спирали (чтобы казино не ломало баланс)</h4>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• <strong>Лимит ставок:</strong> макс. 30% от текущих монет за одну ставку</li>
                <li>• <strong>Защита от банкротства:</strong> если монет &lt;500, казино даёт «кредит удачи» (гарантированный малый выигрыш)</li>
                <li>• <strong>Кулдаун:</strong> после 3 проигрышей подряд — бонусный спин (бесплатно)</li>
                <li>• <strong>Награды не OP:</strong> казино даёт монеты/скины/косметику, НЕ имбалансные апгрейды</li>
                <li>• <strong>Дебаффы временные:</strong> длятся 1 маршрут, не накапливаются</li>
                <li>• <strong>Pity system:</strong> после 10 проигрышей — гарантированный джекпот (как в гаче)</li>
              </ul>
            </div>

            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <h4 className="text-orange-400 font-bold mb-2">💰 Экономика казино</h4>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-orange-400">
                    <th className="pb-2">Действие</th>
                    <th className="pb-2">Монеты</th>
                    <th className="pb-2">Ожидаемая ценность</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-t border-gray-700"><td className="py-2">Слоты (100)</td><td>−100</td><td>−35 (house edge 35%)</td></tr>
                  <tr className="border-t border-gray-700"><td className="py-2">Рулетка (200)</td><td>−200</td><td>−28 (house edge 14%)</td></tr>
                  <tr className="border-t border-gray-700"><td className="py-2">Напёрстки (300)</td><td>−300</td><td>−100 (house edge 33%)</td></tr>
                  <tr className="border-t border-gray-700"><td className="py-2">Ставка на вагон (500)</td><td>−500</td><td>+167 (если вагон выживает)</td></tr>
                </tbody>
              </table>
            </div>
          </Section>

          {/* Progression */}
          <Section id="progression" title="📈 Прогрессия">
            <h3 className="text-xl font-bold text-orange-300 mb-4">Система монет</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="text-green-400 font-bold mb-2">💚 Источники дохода</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Спасённый пассажир: <span className="text-green-300">+10 монет</span></li>
                  <li>• Убитый враг: <span className="text-green-300">+25-100 монет</span> (от типа)</li>
                  <li>• Пройденный маршрут: <span className="text-green-300">+500-2000 монет</span></li>
                  <li>• Бонус «без потерь»: <span className="text-green-300">×1.5 множитель</span></li>
                  <li>• S-ранг: <span className="text-green-300">+100% бонус</span></li>
                  <li>• Ежедневный маршрут: <span className="text-green-300">+500 монет</span></li>
                </ul>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="text-red-400 font-bold mb-2">💸 Траты</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Патроны (50 шт): <span className="text-red-300">200 монет</span></li>
                  <li>• Ремонтный набор: <span className="text-red-300">150 монет</span></li>
                  <li>• Апгрейд брони (+100 HP): <span className="text-red-300">500 монет</span></li>
                  <li>• Новый вагон: <span className="text-red-300">1000-3000 монет</span></li>
                  <li>• Скин локомотива: <span className="text-red-300">2000-5000 монет</span></li>
                  <li>• Новый локомотив: <span className="text-red-300">3000-12000 монет</span></li>
                  <li>• Казино: <span className="text-red-300">100-1000 монет</span></li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-bold text-orange-300 mb-4">Апгрейды поезда</h3>
            <div className="space-y-3">
              <UpgradeRow name="Броня корпуса" levels={['+200 HP (500)', '+500 HP (1500)', '+1000 HP (4000)']} />
              <UpgradeRow name="Ускоритель" levels={['+10% скорость (800)', '+20% (2000)', '+30% + нитро (5000)']} />
              <UpgradeRow name="Пушка — урон" levels={['+25% (600)', '+50% (2000)', '+100% + AOE (6000)']} />
              <UpgradeRow name="Пушка — перезарядка" levels={['-15% (400)', '-30% (1200)', '-50% (3500)']} />
              <UpgradeRow name="Авто-ремонт" levels={['+2 HP/с (1000)', '+5 HP/с (3000)', '+10 HP/с (8000)']} />
              <UpgradeRow name="Сцепка" levels={['Усиленная (700)', 'Несъёмная (2500)', 'Адаптивная (5000)']} />
            </div>

            <h3 className="text-xl font-bold text-orange-300 mt-8 mb-4">Ранговая система</h3>
            <div className="grid grid-cols-5 gap-2 text-center">
              <RankCard rank="S" color="text-yellow-400" bg="bg-yellow-900/30" desc="0 потерь, все враги убиты, &lt;25 мин" />
              <RankCard rank="A" color="text-green-400" bg="bg-green-900/30" desc="≤5 потерь, &lt;30 мин" />
              <RankCard rank="B" color="text-blue-400" bg="bg-blue-900/30" desc="≤15 потерь, все вагоны целы" />
              <RankCard rank="C" color="text-gray-400" bg="bg-gray-800" desc="Добрались, но с потерями" />
              <RankCard rank="D" color="text-red-400" bg="bg-red-900/30" desc="Поезд стал арт-объектом" />
            </div>
          </Section>

          {/* Levels */}
          <Section id="levels" title="🗺️ Уровни и эпизоды">
            <p className="text-gray-300 mb-6">
              Каждый маршрут — это уникальный эпизод с биомами, врагами и боссом. 
              Маршруты генерируются из сегментов (ручная работа), но порядок сегментов и события — процедурные.
            </p>

            <div className="space-y-6">
              <LevelCard
                num={1}
                name="«Первый Рейс»"
                biome="🌲 Лес / Пригород"
                length="12 км"
                difficulty="Обучающий"
                desc="Короткий маршрут через лес. Бандиты на дрезинах, коровы на путях, шлагбаумы."
                enemies="Бандиты (2-3 волны), шлагбаумы"
                boss="Нет босса. Финал: мост с препятствием (научиться тормозить)"
                reward="500 монет, открытие ТЭП70"
              />
              <LevelCard
                num={2}
                name="«Пустынный Экспресс»"
                biome="🏜️ Пустыня"
                length="25 км"
                difficulty="Средний"
                desc="Длинный открытый маршрут. Птеродактили, песчаные бури (снижают видимость), бандиты на верблюдах (да, серьёзно)."
                enemies="Птеродактили, бандиты на верблюдах, дроны"
                boss="«Песчаный Червь» — гигантская тварь, выпрыгивает из-под рельсов"
                reward="1200 монет, скин «Ржавый»"
              />
              <LevelCard
                num={3}
                name="«Ночной Город»"
                biome="🌃 Мегаполис (ночь)"
                length="18 км"
                difficulty="Средний"
                desc="Поезд мчится через ночной город. Машины на переездах, неоновые вывески, абордажники с крыш."
                enemies="Абордажники, дроны-камикадзе, машины-препятствия"
                boss="«Мега-Дрон» — летающая крепость, стреляет лазерами"
                reward="1500 монет, вагон-казино"
              />
              <LevelCard
                num={4}
                name="«Сибирь: Вечная Мерзлота»"
                biome="❄️ Тайга / Снег"
                length="30 км"
                difficulty="Сложный"
                desc="Метель, обледенелые рельсы (сцепление −30%), снежные лавины. Бандиты на снегоходах."
                enemies="Снегоходчики, лавины, обледенение, белые медведи"
                boss="«Ледяной Голем» — кидает глыбы, замораживает пушку"
                reward="2000 монет, бронированный вагон"
              />
              <LevelCard
                num={5}
                name="«Зона Отчуждения»"
                biome="☢️ Аномальная зона"
                length="20 км"
                difficulty="Очень сложный"
                desc="Гравитационные аномалии, телепортация, мутанты. Поезд иногда летает. Буквально."
                enemies="Мутанты, аномалии гравитации, призраки, летающие обломки"
                boss="«Аномальный Поезд» — зеркальная копия вашего состава, но злая"
                reward="3000 монет, секретный фрагмент"
              />
              <LevelCard
                num={6}
                name="«Вулканический Экспресс»"
                biome="🌋 Вулкан"
                length="22 км"
                difficulty="Кошмар"
                desc="Лава, извержения, мосты над кальдерой. Вагоны загораются сами по себе."
                enemies="Огненные элементали, лавовые потоки, птеродактили-мутанты"
                boss="«Вулканический Титан» — рождается из лавы, 3 фазы"
                reward="4000 монет, огнемёт-апгрейд"
              />
              <LevelCard
                num={7}
                name="«Последний Рейс»"
                biome="🌀 Все биомы (микс)"
                length="50 км"
                difficulty="ФИНАЛ"
                desc="Все биомы в одном маршруте. Все враги. Все боссы (мини-версии). Финальный босс — «Император Рельсов»."
                enemies="ВСЁ. Абсолютно всё. И птеродактили-мутанты на снегоходах."
                boss="«Император Рельсов» — гигантский мех-поезд с ИИ, 5 фаз"
                reward="10000 монет, аномальный локомотив, титры"
              />
            </div>
          </Section>

          {/* Physics */}
          <Section id="physics" title="💥 Физическая система">
            <p className="text-gray-300 mb-4">
              Физика — это не просто механика, это <strong className="text-orange-400">комедийный инструмент</strong>. 
              Каждый сход с рельсов должен генерировать скриншот для Twitter.
            </p>

            <h3 className="text-xl font-bold text-orange-300 mb-4">Chaos Physics: Настройка поезда</h3>
            <div className="p-4 bg-gray-800 rounded-lg mb-6">
              <pre className="text-sm text-green-300 overflow-x-auto whitespace-pre-wrap">{`// BP_TrainPhysics — основная логика физики поезда
// Используется Chaos Physics для разрушений и ragdoll

UCLASS()
class ATrainPhysicsActor : public AActor
{
    // Массив вагонов, каждый — отдельный PhysicsActor
    UPROPERTY()
    TArray<FTraintCarPhysicsData> Cars;
    
    // Параметры схода с рельсов
    UPROPERTY(EditDefaultsOnly)
    float DerailSpeedThreshold = 16.7f; // м/с (60 км/ч)
    
    UPROPERTY(EditDefaultsOnly)  
    float DerailLateralForce = 500000.f; // Ньютоны
    
    // Функция проверки схода
    void CheckDerailment(float CurrentSpeed, float CurveRadius)
    {
        float Centrifugal = (CurrentSpeed * CurrentSpeed) / CurveRadius;
        float Threshold = DerailSpeedThreshold * DerailSpeedThreshold / MinCurveRadius;
        
        if (Centrifugal > Threshold)
        {
            // СХОД! Применяем импульс каждому вагону
            for (auto& Car : Cars)
            {
                Car.Body->AddImpulse(
                    FVector(FMath::RandRange(-1f, 1f), 
                           FMath::RandRange(2f, 5f), // ВВЕРХ!
                           FMath::RandRange(-1f, 1f)) * DerailLateralForce
                );
                // Активируем ragdoll для пассажиров
                Car.SpawnPassengerRagdolls();
            }
            OnDerailment.Broadcast(); // Ивент для UI/звука
        }
    }
};`}</pre>
            </div>

            <h3 className="text-xl font-bold text-orange-300 mb-4">Типы разрушений</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="text-yellow-400 font-bold mb-2">🔨 Разрушаемое окружение</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Заборы — разлетаются на куски (Chaos Destruction)</li>
                  <li>• Столбы — падают с реалистичной физикой</li>
                  <li>• Машины на переездах — отлетают с ragdoll</li>
                  <li>• Деревья у путей — подламываются, падают на вагоны</li>
                  <li>• Мостовые опоры — при достаточном уроне мост рушится</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="text-red-400 font-bold mb-2">💥 Разрушения поезда</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Вагоны деформируются (morph targets + chaos)</li>
                  <li>• Стёкла разбиваются (particle system)</li>
                  <li>• Колёса отлетают (detach physics body)</li>
                  <li>• Сцепки рвутся при боковом ударе &gt;100kN</li>
                  <li>• Пожар — particle + damage over time</li>
                  <li>• Взрыв котла — КРАСИВЫЙ boom с ragdoll</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
              <h4 className="text-red-400 font-bold mb-2">🚀 Система «Случайного Полёта» (RFS — Random Flight System)</h4>
              <p className="text-gray-300 text-sm mb-3">
                Специальная система, которая при определённых условиях запускает поезд/вагон в полёт:
              </p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <strong>Трамплин:</strong> сломанный участок рельсов + высокая скорость = полёт 50-200м</li>
                <li>• <strong>Взрыв снизу:</strong> мина/бомба под рельсами = вагон подбрасывает на 20-50м</li>
                <li>• <strong>Аномалия:</strong> гравитационный бабл = весь состав летит 3-10 сек</li>
                <li>• <strong>Катапульта:</strong> секретный элемент на некоторых картах (пасхалка)</li>
              </ul>
              <p className="text-xs text-gray-500 mt-2">
                * В полёте включается slow-mo на 2 сек для максимального эпика. Камера автоматически переключается на кинематографический ракурс.
              </p>
            </div>
          </Section>

          {/* Tech */}
          <Section id="tech" title="🔧 Технические рекомендации">
            <h3 className="text-xl font-bold text-orange-300 mb-4">Архитектура на Unreal Engine 5</h3>
            
            <div className="space-y-4">
              <TechCard
                title="Система рельс (Track System)"
                desc="Spline-based система. Поезд движется вдоль SplineComponent с расчётом позиции по длине."
                implementation={`
• USplineComponent для каждого участка пути
• FTrackSegment: StartSpline, EndSpline, SwitchPoints
• ATrainController: GetCurrentPosition() → FVector на spline
• Скорость: AddInputVector(SplineDirection * Speed * DeltaTime)
• Стрелки: SwitchTrack(TrackID) → меняет целевой spline
                `.trim()}
              />
              <TechCard
                title="Система кооператива"
                desc="Replication через Unreal's Networking. Каждый игрок — Owner своей роли."
                implementation={`
• GameMode: ARailMayhemGameMode (серверная логика)
• PlayerController: ARailMayhemPC (input + camera)
• Pawn: каждая роль — отдельный APawn
  - ATrainDriverPawn (машинист)
  - ATurretPawn (стрелок)  
  - ARepairPawn (ремонтник)
  - ADefenderPawn (защитник)
• Replication: только критичные данные (HP, позиция поезда, состояние вагона)
• Voice Chat: встроенный UE5 VoiceChat
                `.trim()}
              />
              <TechCard
                title="Процедурная генерация маршрутов"
                desc="Маршрут = набор сегментов. Порядок и события — процедурные."
                implementation={`
• URouteGenerator::GenerateRoute(FRouteConfig Config)
  → TArray<FTrackSegment>
• FRouteConfig: Biome, Length, Difficulty, Seed
• Сегменты: прямые, повороты, мосты, тоннели, станции
• Weighted random с учётом сложности
• FEventSpawner: расставляет врагов/события по плотности
                `.trim()}
              />
              <TechCard
                title="Система волн (Wave Director)"
                desc="AI Director — динамическая сложность, как в Left 4 Dead."
                implementation={`
• UWaveDirector::Update(float DeltaTime)
• Параметры: Intensity (0-1), PeakCooldown, RelaxTime
• Если Intensity > 0.8 → спавнить босса
• Если Intensity < 0.3 → дать передышку + бонус
• События: FMath::RandRange(30, 60) сек между пиками
• Множитель от количества игроков: N * 0.8
                `.trim()}
              />
            </div>

            <h3 className="text-xl font-bold text-orange-300 mt-8 mb-4">Оптимизация</h3>
            <div className="p-4 bg-gray-800 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-orange-400">
                    <th className="pb-2">Проблема</th>
                    <th className="pb-2">Решение</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-t border-gray-700">
                    <td className="py-2">Много physics actors (поезд + враги + обломки)</td>
                    <td>Chaos: sleep threshold, LOD для физики, pooling обломков</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="py-2">Дальность отрисовки (поезд длинный)</td>
                    <td>HLOD для вагонов, Nanite для окружения, culling по секторам</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="py-2">Сетевой трафик (4 игрока + NPC)</td>
                    <td>Реплицируем только состояния, не каждую кость. NPC — серверная симуляция</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="py-2">Разрушения (Chaos Destruction тяжёлый)</td>
                    <td>Geometry Collection LOD, ограничение кол-ва обломков (max 500), pooling</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="py-2">Low-poly стиль + освещение</td>
                    <td>Lumen для GI (low-res), flat shading через material, vertex colors</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          {/* Assets */}
          <Section id="assets" title="📦 Ассеты и референсы">
            <h3 className="text-xl font-bold text-orange-300 mb-4">Модели поездов (реальные прототипы)</h3>
            <div className="space-y-3">
              <AssetCard
                name="ВЛ80 (Владимир Ленин, 80)"
                ref_info="Электровоз, выпускался 1961-1995. Двухсекционный. Длина: 2×17м. Мощность: 6520 кВт."
                model="Low-poly: ~5000 трис. Текстура: 1024×1024 (намеренно пиксельная). Цвет: зелёный с красной полосой."
              />
              <AssetCard
                name="ТЭП70"
                ref_info="Тепловоз, 1973-2006. Односекционный. Длина: 21.5м. Скорость макс: 120 км/ч."
                model="Low-poly: ~4000 трис. Цвет: красный/синий. Характерный «нос» — утрировать."
              />
              <AssetCard
                name="ЧС2 (Чехословацкий)"
                ref_info="Электровоз из ЧССР, 1965-1999 в СССР/РФ. Элегантный дизайн. Длина: 17.4м."
                model="Low-poly: ~4500 трис. Бежево-коричневый. Округлые формы — стилизовать."
              />
              <AssetCard
                name="ЭР2 (Электричка)"
                ref_info="Электропоезд пригородный, 1962-2008. 4-12 вагонов. Длина вагона: 24.5м."
                model="Low-poly: ~3000 трис/вагон. Синий/голубой. Характерные «гармошки» между вагонами."
              />
              <AssetCard
                name="2ТЭ10М"
                ref_info="Мощный грузовой тепловоз. Две секции. Длина: 2×17.5м. Тяга: 2×3000 л.с."
                model="Low-poly: ~7000 трис. Тёмно-зелёный. Массивный, «танковый» вид."
              />
            </div>

            <h3 className="text-xl font-bold text-orange-300 mt-8 mb-4">Вагоны (реальные прототипы)</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-3 bg-gray-800 rounded-lg text-sm">
                <strong className="text-orange-300">Пассажирский плацкартный</strong>
                <p className="text-gray-400 text-xs mt-1">Прототип: вагон модели 61-4174. Открытые полки, чай в подстаканниках. ~4000 трис.</p>
              </div>
              <div className="p-3 bg-gray-800 rounded-lg text-sm">
                <strong className="text-orange-300">Грузовой крытый</strong>
                <p className="text-gray-400 text-xs mt-1">Прототип: вагон 11-217. Металлический, ржавый. ~2000 трис.</p>
              </div>
              <div className="p-3 bg-gray-800 rounded-lg text-sm">
                <strong className="text-orange-300">Платформа</strong>
                <p className="text-gray-400 text-xs mt-1">Прототип: платформа 13-4093. Открытая, для пушки. ~1500 трис.</p>
              </div>
              <div className="p-3 bg-gray-800 rounded-lg text-sm">
                <strong className="text-orange-300">Цистерна</strong>
                <p className="text-gray-400 text-xs mt-1">Прототип: цистерна 15-4299. Взрывается КРАСИВО. ~2500 трис.</p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-orange-300 mt-8 mb-4">Референсы для визуала</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-3 bg-gray-800 rounded-lg text-sm">
                <strong className="text-blue-300">🎮 Игровые референсы</strong>
                <ul className="text-gray-400 text-xs mt-1 space-y-1">
                  <li>• Repo (2024) — low-poly хоррор-эстетика</li>
                  <li>• Memezis — мемный дизайн персонажей</li>
                  <li>• Hold to Fish — казино + абсурд</li>
                  <li>• Totally Accurate Battle Simulator — ragdoll</li>
                  <li>• Train Sim World — реальные поезда</li>
                </ul>
              </div>
              <div className="p-3 bg-gray-800 rounded-lg text-sm">
                <strong className="text-purple-300">🎨 Визуальные референсы</strong>
                <ul className="text-gray-400 text-xs mt-1 space-y-1">
                  <li>• PS1/PS2 era textures (affine mapping, low res)</li>
                  <li>• Flat shading + vertex colors</li>
                  <li>• Soviet train photography (real colors)</li>
                  <li>• «Кривые» UV — намеренно, для стиля</li>
                  <li>• Современное освещение (Lumen) на low-poly</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-bold text-orange-300 mt-8 mb-4">Звуковые ассеты</h3>
            <div className="p-4 bg-gray-800 rounded-lg text-sm">
              <ul className="text-gray-300 space-y-2">
                <li>• <strong>Гудки:</strong> реальные записи ВЛ80, ЧС2, ЭР2 (громкие, басовитые)</li>
                <li>• <strong>Стук колёс:</strong> зацикленный луп, pitch зависит от скорости</li>
                <li>• <strong>Пушка:</strong> гибрид гаубицы + бас-буста. Экран трясётся.</li>
                <li>• <strong>Разрушения:</strong> metal crunch + glass break + ragdoll thuds</li>
                <li>• <strong>Казино:</strong> джаз/шансон из динамика, звон монет, «колесо» звук</li>
                <li>• <strong>Пассажиры:</strong> крики, «Ой-ой-ой!», «Мамочки!», «Тормози, дурак!»</li>
                <li>• <strong>Музыка:</strong> dynamic soundtrack, intensity layers. Баян при низком intensity, оркестр + метал при высоком.</li>
              </ul>
            </div>
          </Section>

          {/* Timeline */}
          <Section id="timeline" title="📅 План разработки">
            <h3 className="text-xl font-bold text-orange-300 mb-4">Месяц 1: Прототип</h3>
            <div className="space-y-3">
              <WeekCard
                week="Неделя 1-2: Ядро движения"
                tasks={[
                  'Spline-based система рельс (Blueprint)',
                  'Базовое движение поезда (скорость, торможение)',
                  'Камера машиниста (первое/третье лицо)',
                  'Один сегмент пути (прямая + поворот)',
                  'Базовая физика сцепки вагонов',
                ]}
              />
              <WeekCard
                week="Неделя 3: Роли и кооп"
                tasks={[
                  '2 роли: машинист + стрелок',
                  'Базовая пушка (наведение + выстрел)',
                  'Простейший враг (дрезина, едет рядом)',
                  'Сплит-скрин для локального коопа (2 игрока)',
                  'Тест: 1 минута геймплея',
                ]}
              />
              <WeekCard
                week="Неделя 4: Физика хаоса"
                tasks={[
                  'Chaos Physics для поезда (сход с рельсов)',
                  'Разрушаемые объекты (забор, столб)',
                  'Ragdoll для пассажиров',
                  'Система HP вагонов',
                  'Тест: поезд летит с моста (ЦЕЛЬ!)',
                ]}
              />
            </div>

            <h3 className="text-xl font-bold text-orange-300 mt-8 mb-4">Месяцы 2-3: MVP</h3>
            <div className="space-y-3">
              <MonthCard
                month="Месяц 2: Контент"
                tasks={[
                  'Все 4 роли реализованы',
                  '3 типа врагов (бандиты, птеродактили, дроны)',
                  '1 полный маршрут (лес, 12 км)',
                  'Система волн (AI Director)',
                  'Базовое депо (покупка/продажа)',
                  'Low-poly модели: ВЛ80 + 3 вагона',
                  'Сетевой кооп (2-4 игрока через Steam)',
                ]}
              />
              <MonthCard
                month="Месяц 3: Полировка MVP"
                tasks={[
                  'Казино (2 мини-игры: слоты + рулетка)',
                  'Система монет и апгрейдов',
                  'Звуки + музыка (dynamic)',
                  'UI/UX: HUD, меню, экран результатов',
                  'Баланс: 20-минутная сессия играбельна',
                  '2-й маршрут (пустыня)',
                  'Первый босс',
                  'Вертикальный срез для Steam page',
                ]}
              />
            </div>

            <h3 className="text-xl font-bold text-orange-300 mt-8 mb-4">Дальнейший план (после MVP)</h3>
            <div className="p-4 bg-gray-800 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-orange-400">
                    <th className="pb-2">Фаза</th>
                    <th className="pb-2">Срок</th>
                    <th className="pb-2">Содержание</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-t border-gray-700"><td className="py-2">Alpha</td><td>4-6 мес</td><td>Все 7 маршрутов, все враги, казино полностью</td></tr>
                  <tr className="border-t border-gray-700"><td className="py-2">Beta</td><td>7-9 мес</td><td>Баланс, полировка, все локомотивы, скины</td></tr>
                  <tr className="border-t border-gray-700"><td className="py-2">Early Access</td><td>10 мес</td><td>Steam Early Access, фидбек, итерации</td></tr>
                  <tr className="border-t border-gray-700"><td className="py-2">Релиз</td><td>12-14 мес</td><td>Полный релиз + DLC-план</td></tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-orange-900/20 border border-orange-700/50 rounded-lg">
              <h4 className="text-orange-400 font-bold mb-2">👥 Команда (минимальная)</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <strong>1× Геймдизайнер/Продюсер</strong> — баланс, уровни, фичи</li>
                <li>• <strong>2× UE5 Программист</strong> — gameplay + networking</li>
                <li>• <strong>1× 3D-художник</strong> — low-poly модели, текстуры</li>
                <li>• <strong>1× Технический художник</strong> — шейдеры, VFX, физика</li>
                <li>• <strong>0.5× Звуковик</strong> — SFX, музыка (можно аутсорс)</li>
                <li>• <strong>0.5× QA</strong> — тестирование (на раннем этапе — вся команда)</li>
              </ul>
              <p className="text-xs text-gray-500 mt-2">Итого: 4-5 человек. Бюджет: ~150-200к$/год (инди-стандарт).</p>
            </div>

            <div className="mt-8 text-center py-8 border-t border-gray-800">
              <div className="text-4xl mb-4">🚂💨</div>
              <p className="text-gray-400 italic">
                «Поезд едет, пассажиры кричат, казино работает, птеродактиль тащит вагон —<br/>
                всё как мы любим. Добро пожаловать в Rail Mayhem.»
              </p>
              <p className="text-gray-600 text-sm mt-4">GDD v1.0 — Rail Mayhem: Depot to Depot</p>
            </div>
          </Section>
        </div>
      </main>
    </div>
  );
}

// === Sub-components ===

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-4">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-3 border-b border-gray-800">
        {title}
      </h2>
      {children}
    </section>
  );
}

function InfoCard({ title, content }: { title: string; content: string }) {
  return (
    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
      <h4 className="text-orange-400 font-bold text-sm mb-1">{title}</h4>
      <p className="text-gray-300 text-sm">{content}</p>
    </div>
  );
}

function RefCard({ game, why }: { game: string; why: string }) {
  return (
    <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
      <div className="font-bold text-sm text-blue-300">{game}</div>
      <div className="text-xs text-gray-400 mt-1">{why}</div>
    </div>
  );
}

function PhaseCard({ phase, color, items }: { phase: string; color: string; items: string[] }) {
  const colorMap: Record<string, string> = {
    blue: 'border-blue-500/50 bg-blue-900/10',
    yellow: 'border-yellow-500/50 bg-yellow-900/10',
    orange: 'border-orange-500/50 bg-orange-900/10',
    red: 'border-red-500/50 bg-red-900/10',
    green: 'border-green-500/50 bg-green-900/10',
  };
  return (
    <div className={`p-4 rounded-lg border ${colorMap[color]}`}>
      <h4 className="font-bold text-white mb-2">{phase}</h4>
      <ul className="text-sm text-gray-300 space-y-1">
        {items.map((item, i) => <li key={i}>• {item}</li>)}
      </ul>
    </div>
  );
}

function RoleCard({ role, description, controls, ue5 }: { role: string; description: string; controls: string[]; ue5: string }) {
  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      <h4 className="text-lg font-bold text-orange-300 mb-1">{role}</h4>
      <p className="text-sm text-gray-400 mb-3">{description}</p>
      <div className="mb-3">
        <div className="text-xs text-gray-500 uppercase mb-1">Управление:</div>
        <ul className="text-sm text-gray-300 space-y-0.5">
          {controls.map((c, i) => <li key={i} className="font-mono text-xs">{c}</li>)}
        </ul>
      </div>
      <div className="text-xs text-green-400/70 bg-green-900/10 p-2 rounded">
        <span className="text-green-500">UE5:</span> {ue5}
      </div>
    </div>
  );
}

function TrainCard({ name, type, stats, desc, unlock }: {
  name: string; type: string;
  stats: { speed: number; hp: number; accel: number; price: number | string };
  desc: string; unlock: string;
}) {
  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-orange-300">{name}</h4>
        <span className="text-xs px-2 py-0.5 bg-gray-700 rounded text-gray-400">{type}</span>
      </div>
      <p className="text-sm text-gray-400 mb-3">{desc}</p>
      <div className="grid grid-cols-3 gap-2 text-center mb-2">
        <div className="bg-gray-700/50 p-1.5 rounded">
          <div className="text-xs text-gray-400">Скорость</div>
          <div className="text-sm font-bold text-blue-300">{stats.speed} км/ч</div>
        </div>
        <div className="bg-gray-700/50 p-1.5 rounded">
          <div className="text-xs text-gray-400">HP</div>
          <div className="text-sm font-bold text-green-300">{stats.hp}</div>
        </div>
        <div className="bg-gray-700/50 p-1.5 rounded">
          <div className="text-xs text-gray-400">Разгон</div>
          <div className="text-sm font-bold text-yellow-300">{stats.accel}x</div>
        </div>
      </div>
      <div className="text-xs text-gray-500">🔓 {unlock}</div>
    </div>
  );
}

function WagonCard({ emoji, name, hp, capacity, desc }: { emoji: string; name: string; hp: number; capacity: number; desc: string }) {
  return (
    <div className="p-3 bg-gray-800 rounded-lg border border-gray-700 text-center">
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="font-bold text-sm text-orange-300">{name}</div>
      <div className="text-xs text-gray-400 mt-1">HP: {hp} | Мест: {capacity}</div>
      <div className="text-xs text-gray-500 mt-1">{desc}</div>
    </div>
  );
}

function DepotCard({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="p-3 bg-gray-800 rounded-lg border border-gray-700 flex gap-3 items-center">
      <div className="text-2xl">🏗️</div>
      <div>
        <div className="font-bold text-sm text-orange-300">{name}</div>
        <div className="text-xs text-gray-400">{desc}</div>
      </div>
    </div>
  );
}

function EnemyCard({ name, act, hp, damage, desc, behavior }: {
  name: string; act: number; hp: number; damage: number; desc: string; behavior: string;
}) {
  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-red-300">{name}</h4>
        <span className="text-xs px-2 py-0.5 bg-red-900/50 rounded text-red-300">Акт {act}</span>
      </div>
      <p className="text-sm text-gray-400 mb-2">{desc}</p>
      <div className="flex gap-4 mb-2">
        <span className="text-xs text-green-400">HP: {hp}</span>
        <span className="text-xs text-red-400">Урон: {damage}</span>
      </div>
      <div className="text-xs text-gray-500 bg-gray-900/50 p-2 rounded">
        <strong>AI:</strong> {behavior}
      </div>
    </div>
  );
}

function CasinoGame({ name, cost, desc, odds, rewards }: {
  name: string; cost: string; desc: string; odds: string; rewards: string;
}) {
  return (
    <div className="p-4 bg-gradient-to-br from-purple-900/30 to-gray-800 rounded-lg border border-purple-700/50">
      <h4 className="font-bold text-purple-300 mb-1">{name}</h4>
      <div className="text-xs text-yellow-400 mb-2">Ставка: {cost}</div>
      <p className="text-sm text-gray-300 mb-2">{desc}</p>
      <div className="text-xs text-gray-400 mb-1"><strong>Шансы:</strong> {odds}</div>
      <div className="text-xs text-gray-400"><strong>Награды:</strong> {rewards}</div>
    </div>
  );
}

function UpgradeRow({ name, levels }: { name: string; levels: string[] }) {
  return (
    <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
      <div className="font-bold text-sm text-orange-300 mb-2">{name}</div>
      <div className="flex gap-2 flex-wrap">
        {levels.map((level, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="text-xs text-yellow-400">Ур.{i + 1}:</span>
            <span className="text-xs text-gray-300">{level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RankCard({ rank, color, bg, desc }: { rank: string; color: string; bg: string; desc: string }) {
  return (
    <div className={`p-3 rounded-lg ${bg}`}>
      <div className={`text-2xl font-black ${color}`}>{rank}</div>
      <div className="text-xs text-gray-400 mt-1">{desc}</div>
    </div>
  );
}

function LevelCard({ num, name, biome, length, difficulty, desc, enemies, boss, reward }: {
  num: number; name: string; biome: string; length: string; difficulty: string;
  desc: string; enemies: string; boss: string; reward: string;
}) {
  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
        <div>
          <span className="text-xs text-gray-500">Эпизод #{num}</span>
          <h4 className="font-bold text-orange-300">{name}</h4>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs px-2 py-0.5 bg-gray-700 rounded text-gray-300">{biome}</span>
          <span className="text-xs px-2 py-0.5 bg-gray-700 rounded text-gray-300">{length}</span>
          <span className="text-xs px-2 py-0.5 bg-orange-900/50 rounded text-orange-300">{difficulty}</span>
        </div>
      </div>
      <p className="text-sm text-gray-400 mb-3">{desc}</p>
      <div className="grid md:grid-cols-3 gap-2 text-xs">
        <div className="bg-gray-900/50 p-2 rounded">
          <span className="text-red-400 font-bold">Враги:</span>
          <p className="text-gray-400 mt-0.5">{enemies}</p>
        </div>
        <div className="bg-gray-900/50 p-2 rounded">
          <span className="text-purple-400 font-bold">Босс:</span>
          <p className="text-gray-400 mt-0.5">{boss}</p>
        </div>
        <div className="bg-gray-900/50 p-2 rounded">
          <span className="text-green-400 font-bold">Награда:</span>
          <p className="text-gray-400 mt-0.5">{reward}</p>
        </div>
      </div>
    </div>
  );
}

function TechCard({ title, desc, implementation }: { title: string; desc: string; implementation: string }) {
  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      <h4 className="font-bold text-blue-300 mb-1">{title}</h4>
      <p className="text-sm text-gray-400 mb-3">{desc}</p>
      <pre className="text-xs text-green-300/80 bg-gray-900 p-3 rounded overflow-x-auto whitespace-pre-wrap font-mono">
        {implementation}
      </pre>
    </div>
  );
}

function AssetCard({ name, ref_info, model }: { name: string; ref_info: string; model: string }) {
  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      <h4 className="font-bold text-orange-300 mb-2">{name}</h4>
      <div className="text-sm text-gray-400 mb-1"><strong>Прототип:</strong> {ref_info}</div>
      <div className="text-sm text-gray-400"><strong>Модель:</strong> {model}</div>
    </div>
  );
}

function WeekCard({ week, tasks }: { week: string; tasks: string[] }) {
  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      <h4 className="font-bold text-blue-300 mb-2">{week}</h4>
      <ul className="text-sm text-gray-300 space-y-1">
        {tasks.map((task, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">☐</span>
            <span>{task}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MonthCard({ month, tasks }: { month: string; tasks: string[] }) {
  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      <h4 className="font-bold text-orange-300 mb-2">{month}</h4>
      <ul className="text-sm text-gray-300 space-y-1">
        {tasks.map((task, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-orange-400 mt-0.5">•</span>
            <span>{task}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
