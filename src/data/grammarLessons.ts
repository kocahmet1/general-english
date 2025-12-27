import { GrammarLesson, GrammarTopic } from '../types/grammarLesson';
import { additionalGrammarLessons } from './additionalGrammarLessons';

export const grammarLessons: GrammarLesson[] = [
    // 1. Present Tenses
    {
        topic: GrammarTopic.PresentTenses,
        title: 'Present Tenses',
        description: 'Present Simple, Continuous, Perfect ve Perfect Continuous zamanlarını öğrenin',
        difficulty: 'intermediate',
        estimatedTime: 25,
        icon: '⏰',
        color: '#4CAF50',
        sections: [
            {
                type: 'theory',
                title: 'Genel Bakış',
                content: `Present Tenses (Şimdiki/Geniş Zamanlar), İngilizcenin temelidir. Sadece "şu an" değil, genel doğrular ve alışkanlıklardan bahsetmek için de kullanılır.

> [!TIP]
> **Püf Noktası**: Her zaman "Eylem ne sıklıkla yapılıyor?" veya "Eylem şu an mı oluyor?" sorusunu kendinize sorun.

### 1. Present Simple (Geniş Zaman)
**Mantık**: Değişmeyen gerçekler, rutinler ve alışkanlıklar.
**Yapı**: I/You/We/They + Fiil | He/She/It + Fiil**-(s)**
- **Kullanım**: "Water boils at 100°C." (Bilimsel gerçek)
- **Kullanım**: "I drink coffee every morning." (Rutin)
- **Anahtar Kelimeler**: *always, usually, often, every day*.

### 2. Present Continuous (Şimdiki Zaman)
**Mantık**: Konuşma anında gerçekleşen veya geçici olan durumlar.
**Yapı**: am/is/are + fiil-**ing**
- **Kullanım**: "I am talking to you now." (Şu an)
- **Kullanım**: "She is staying with her aunt this week." (Geçici durum)
> [!WARNING]
> **Stative Verbs (Durum Fiilleri)**: *Know, believe, like, want* gibi fiiller genellikle -ing almaz. "I am wanting" yerine "I want" demelisiniz.

### 3. Present Perfect (Yakın Geçmiş Zaman)
**Mantık**: Geçmişte olmuş ama zamanı önemli değil; önemli olan **etkisi/sonucu**.
**Yapı**: have/has + **V3** (Fiilin 3. hali)
- **Kullanım**: "I have lost my keys." (Anahtarlarım şu an yok, sonuç önemli).
- **Deneyim**: "Have you ever been to Paris?" (Hayatındaki bir deneyim).
- **Anahtar Kelimeler**: *just, already, yet, ever, never, since, for*.

### 4. Present Perfect Continuous (Süreç Vurgulu)
**Mantık**: Geçmişte başlayan ve hala devam eden bir eylemin **ne kadar sürdüğünü** vurgular.
**Yapı**: have/has + been + fiil-**ing**
- **Örnek**: "It has been raining for 3 hours." (Yağmur 3 saat önce başladı ve hala yağıyor).
- **Fark**: Present Perfect "sonuca" odaklanırken, Continuous "sürece" odaklanır.`
            },
            {
                type: 'examples',
                title: 'Örneklerle İnceleme',
                examples: [
                    {
                        sentence: 'I drink coffee every morning.',
                        highlight: 'drink',
                        explanation: 'Present Simple - günlük alışkanlık (every morning)'
                    },
                    {
                        sentence: 'He is drinking coffee right now.',
                        highlight: 'is drinking',
                        explanation: 'Present Continuous - şu anda gerçekleşen eylem'
                    },
                    {
                        sentence: 'I have drunk three cups of coffee today.',
                        highlight: 'have drunk',
                        explanation: 'Present Perfect - tamamlanmamış zaman diliminde eylem (today)'
                    },
                    {
                        sentence: 'I have been drinking coffee since 6 AM.',
                        highlight: 'have been drinking',
                        explanation: 'Present Perfect Continuous - süreci vurgulayan devam eden eylem'
                    }
                ]
            },
            {
                type: 'tips',
                title: 'Sık Yapılan Hatalar',
                tips: [
                    '❌ Durum fiilleriyle (know, like, want, believe) continuous (-ing) kullanmayın.',
                    '❌ Present Simple\'da 3. tekil şahıs (he/she/it) için "s" takısını unutmayın: "He work" → "He works"',
                    '❌ Kesin geçmiş zaman belirtirken Present Perfect kullanmayın: "I have seen him yesterday" → "I saw him yesterday"',
                    '✅ Süreç için "for", başlangıç noktası için "since" kullanın: "for 2 hours" / "since Monday"',
                    '✅ Present Continuous gelecek planları için de kullanılabilir: "I\'m meeting John tomorrow."'
                ]
            }
        ],
        exercises: [
            {
                id: 1,
                quizId: 1,
                type: 'multiple-choice',
                question: 'I _______ coffee every morning.',
                options: ['drink', 'drinks', 'am drinking', 'has drunk'],
                correctAnswer: 'drink',
                explanation: 'Genel alışkanlıklar ve rutinler için Present Simple (V1) kullanılır. Özne "I" olduğu için fiil takı almaz.',
                difficulty: 'beginner'
            },
            {
                id: 2,
                quizId: 1,
                type: 'fill-in-blank',
                question: 'She _______ (work) on a new project these days.',
                options: ['works', 'is working', 'has worked', 'work'],
                correctAnswer: 'is working',
                explanation: 'Şu sıralar devam eden geçici durumlar için Present Continuous (am/is/are + V-ing) kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 3,
                quizId: 1,
                type: 'multiple-choice',
                question: 'They _______ to London three times this year.',
                options: ['go', 'are going', 'have been', 'went'],
                correctAnswer: 'have been',
                explanation: 'Belirsiz bir zamanda gerçekleşmiş ve etkisi süren eylemler için Present Perfect kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 4,
                quizId: 1,
                type: 'fill-in-blank',
                question: 'How long _______ you _______ (wait) for the bus?',
                options: ['do/wait', 'are/waiting', 'have/been waiting', 'has/waited'],
                correctAnswer: 'have/been waiting',
                explanation: 'Geçmişte başlayıp hala devam eden eylemin süresini sormak için Present Perfect Continuous kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 5,
                quizId: 1,
                type: 'multiple-choice',
                question: 'The sun _______ in the east.',
                options: ['rise', 'rises', 'is rising', 'has risen'],
                correctAnswer: 'rises',
                explanation: 'Bilimsel gerçekler ve doğa kanunları her zaman Present Simple ile ifade edilir.',
                difficulty: 'beginner'
            },
            {
                id: 6,
                quizId: 1,
                type: 'fill-in-blank',
                question: 'Look! The baby _______ (sleep). Please be quiet.',
                options: ['sleeps', 'is sleeping', 'has slept', 'was sleeping'],
                correctAnswer: 'is sleeping',
                explanation: 'Konuşma anında gerçekleşen eylemler için Present Continuous kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 7,
                quizId: 1,
                type: 'multiple-choice',
                question: 'I _______ my keys! I can\'t find them anywhere.',
                options: ['lose', 'am losing', 'have lost', 'lost'],
                correctAnswer: 'have lost',
                explanation: 'Sonucu şu anı etkileyen yakın geçmişteki eylemler için Present Perfect kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 8,
                quizId: 1,
                type: 'fill-in-blank',
                question: 'Water _______ (boil) at 100 degrees Celsius.',
                options: ['boil', 'boils', 'is boiling', 'has boiled'],
                correctAnswer: 'boils',
                explanation: 'Genel gerçekler için Present Simple kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 9,
                quizId: 1,
                type: 'multiple-choice',
                question: 'We _______ each other for ten years.',
                options: ['know', 'are knowing', 'have known', 'have been knowing'],
                correctAnswer: 'have known',
                explanation: '"Know" bir durum fiilidir (state verb) ve continuous formda kullanılmaz. Süreç belirtmek için Present Perfect kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 10,
                quizId: 1,
                type: 'multiple-choice',
                question: 'I _______ (not/see) him since last Monday.',
                options: ["don't see", "didn't see", "haven't seen", "am not seeing"],
                correctAnswer: "haven't seen",
                explanation: '"Since + başlangıç noktası" ile Present Perfect kullanılır. Sonucu (onu görmemek) şu anla ilgilidir.',
                difficulty: 'intermediate',
                hint: '"Since" anahtar kelimedir - Present Perfect kullanıldığını gösterir.'
            },

            // Quiz 2: Present Simple & Continuous Focus
            {
                id: 11,
                quizId: 2,
                type: 'multiple-choice',
                question: 'She _______ to the gym every Monday.',
                options: ['go', 'goes', 'is going', 'going'],
                correctAnswer: 'goes',
                explanation: 'Rutin eylemler için Present Simple. 3. tekil şahıs -s takısı alır.',
                difficulty: 'beginner'
            },
            {
                id: 12,
                quizId: 2,
                type: 'multiple-choice',
                question: 'Look! The children _______ in the park.',
                options: ['play', 'plays', 'are playing', 'is playing'],
                correctAnswer: 'are playing',
                explanation: '"Look!" şu anda olan eylemi işaret eder - Present Continuous.',
                difficulty: 'beginner'
            },
            {
                id: 13,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'The sun _______ (rise) in the east.',
                options: ['rise', 'rises', 'is rising', 'has risen'],
                correctAnswer: 'rises',
                explanation: 'Genel gerçekler için Present Simple.',
                difficulty: 'beginner'
            },
            {
                id: 14,
                quizId: 2,
                type: 'multiple-choice',
                question: 'I _______ what you mean.',
                options: ['understand', 'am understanding', 'have understood', 'understanding'],
                correctAnswer: 'understand',
                explanation: '"Understand" durum fiilidir, continuous formda kullanılmaz.',
                difficulty: 'intermediate'
            },
            {
                id: 15,
                quizId: 2,
                type: 'multiple-choice',
                question: 'Be quiet! The baby _______.',
                options: ['sleeps', 'is sleeping', 'sleep', 'has slept'],
                correctAnswer: 'is sleeping',
                explanation: 'Şu anda devam eden eylem için Present Continuous.',
                difficulty: 'beginner'
            },
            {
                id: 16,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'My father _______ (not/like) coffee.',
                options: ["doesn't like", "isn't liking", "don't like", "hasn't liked"],
                correctAnswer: "doesn't like",
                explanation: '"Like" durum fiilidir. Her zaman geçerli tercih için Present Simple.',
                difficulty: 'beginner'
            },
            {
                id: 17,
                quizId: 2,
                type: 'multiple-choice',
                question: 'The train _______ at 9 PM tonight.',
                options: ['leaves', 'is leaving', 'will leave', 'leave'],
                correctAnswer: 'leaves',
                explanation: 'Tarifeli programlar için Present Simple kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 18,
                quizId: 2,
                type: 'multiple-choice',
                question: 'Why _______ you _______ at me like that?',
                options: ['do / look', 'are / looking', 'does / look', 'is / looking'],
                correctAnswer: 'are / looking',
                explanation: 'Şu andaki davranış için Present Continuous.',
                difficulty: 'intermediate'
            },
            {
                id: 19,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'She _______ (always/complain) about everything!',
                options: ['always complains', 'is always complaining', 'has always complained', 'always complain'],
                correctAnswer: 'is always complaining',
                explanation: 'Rahatsız edici alışkanlıklar için "always + Present Continuous".',
                difficulty: 'advanced'
            },
            {
                id: 20,
                quizId: 2,
                type: 'multiple-choice',
                question: 'Dogs _______ meat.',
                options: ['eat', 'eats', 'are eating', 'eating'],
                correctAnswer: 'eat',
                explanation: 'Genel gerçek (tüm köpekler) için Present Simple.',
                difficulty: 'beginner'
            },

            // Quiz 3: Present Perfect Focus
            {
                id: 21,
                quizId: 3,
                type: 'multiple-choice',
                question: 'I _______ this book three times.',
                options: ['read', 'am reading', 'have read', 'was reading'],
                correctAnswer: 'have read',
                explanation: 'Hayat deneyimi için Present Perfect.',
                difficulty: 'beginner'
            },
            {
                id: 22,
                quizId: 3,
                type: 'multiple-choice',
                question: 'She _______ here since 2015.',
                options: ['works', 'is working', 'has worked', 'worked'],
                correctAnswer: 'has worked',
                explanation: '"Since" ile başlayan süreç için Present Perfect.',
                difficulty: 'intermediate'
            },
            {
                id: 23,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'They _______ (just/arrive) at the airport.',
                options: ['just arrive', 'just arrived', 'have just arrived', 'are just arriving'],
                correctAnswer: 'have just arrived',
                explanation: '"Just" ile yakın geçmiş için Present Perfect.',
                difficulty: 'beginner'
            },
            {
                id: 24,
                quizId: 3,
                type: 'multiple-choice',
                question: '_______ you ever _______ sushi?',
                options: ['Did / eat', 'Have / eaten', 'Do / eat', 'Are / eating'],
                correctAnswer: 'Have / eaten',
                explanation: '"Ever" ile hayat deneyimi sorgusu için Present Perfect.',
                difficulty: 'beginner'
            },
            {
                id: 25,
                quizId: 3,
                type: 'multiple-choice',
                question: 'I _______ my homework yet.',
                options: ["don't finish", "didn't finish", "haven't finished", "am not finishing"],
                correctAnswer: "haven't finished",
                explanation: '"Yet" ile tamamlanmamış eylem için Present Perfect.',
                difficulty: 'beginner'
            },
            {
                id: 26,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'He _______ (be) to London twice.',
                options: ['is', 'was', 'has been', 'have been'],
                correctAnswer: 'has been',
                explanation: 'Ziyaret deneyimi için Present Perfect.',
                difficulty: 'beginner'
            },
            {
                id: 27,
                quizId: 3,
                type: 'multiple-choice',
                question: 'How long _______ you _______ English?',
                options: ['do / study', 'are / studying', 'have / studied', 'did / study'],
                correctAnswer: 'have / studied',
                explanation: '"How long" ile süreç sorgusu için Present Perfect.',
                difficulty: 'intermediate'
            },
            {
                id: 28,
                quizId: 3,
                type: 'multiple-choice',
                question: 'This is the best movie I _______ ever _______.',
                options: ['did / see', 'have / seen', 'am / seeing', 'do / see'],
                correctAnswer: 'have / seen',
                explanation: 'Superlative + Present Perfect yapısı.',
                difficulty: 'intermediate'
            },
            {
                id: 29,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'She _______ (already/leave) when I arrived.',
                options: ['already left', 'has already left', 'had already left', 'is already leaving'],
                correctAnswer: 'had already left',
                explanation: 'Dikkat! Başka bir geçmiş eylemden önce - Past Perfect gerekir.',
                difficulty: 'advanced'
            },
            {
                id: 30,
                quizId: 3,
                type: 'multiple-choice',
                question: 'We _______ each other for years.',
                options: ['know', 'are knowing', 'have known', 'knew'],
                correctAnswer: 'have known',
                explanation: '"For years" ile devam eden durum için Present Perfect.',
                difficulty: 'intermediate'
            },

            // Quiz 4: Present Perfect Continuous & Mixed
            {
                id: 31,
                quizId: 4,
                type: 'multiple-choice',
                question: 'She _______ all morning. She looks tired.',
                options: ['works', 'is working', 'has been working', 'worked'],
                correctAnswer: 'has been working',
                explanation: 'Süreç vurgusu ve şimdiki sonuç için Present Perfect Continuous.',
                difficulty: 'intermediate'
            },
            {
                id: 32,
                quizId: 4,
                type: 'multiple-choice',
                question: 'It _______ for three hours. The streets are wet.',
                options: ['rains', 'is raining', 'has been raining', 'rained'],
                correctAnswer: 'has been raining',
                explanation: 'Devam eden eylem + şimdiki sonuç için Present Perfect Continuous.',
                difficulty: 'intermediate'
            },
            {
                id: 33,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'How long _______ you _______ (wait) here?',
                options: ['do / wait', 'are / waiting', 'have / been waiting', 'did / wait'],
                correctAnswer: 'have / been waiting',
                explanation: '"How long" + devam eden süreç için Present Perfect Continuous.',
                difficulty: 'intermediate'
            },
            {
                id: 34,
                quizId: 4,
                type: 'multiple-choice',
                question: 'I _______ three cups of coffee today.',
                options: ['drink', 'am drinking', 'have drunk', 'have been drinking'],
                correctAnswer: 'have drunk',
                explanation: 'Tamamlanmış sayılabilir eylem için Present Perfect (Simple).',
                difficulty: 'advanced'
            },
            {
                id: 35,
                quizId: 4,
                type: 'multiple-choice',
                question: 'Your eyes are red. _______ you _______?',
                options: ['Do / cry', 'Are / crying', 'Have / been crying', 'Did / cry'],
                correctAnswer: 'Have / been crying',
                explanation: 'Görünen sonuç + devam eden eylem için Present Perfect Continuous.',
                difficulty: 'intermediate'
            },
            {
                id: 36,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'He _______ (live) in this city since he was a child.',
                options: ['lives', 'is living', 'has lived', 'has been living'],
                correctAnswer: 'has lived',
                explanation: '"Live" gibi durum fiilleri genelde Simple formda kullanılır.',
                difficulty: 'advanced'
            },
            {
                id: 37,
                quizId: 4,
                type: 'multiple-choice',
                question: 'I _______ about changing my job lately.',
                options: ['think', 'am thinking', 'have thought', 'have been thinking'],
                correctAnswer: 'have been thinking',
                explanation: '"Lately" ile devam eden düşünce süreci için Present Perfect Continuous.',
                difficulty: 'intermediate'
            },
            {
                id: 38,
                quizId: 4,
                type: 'multiple-choice',
                question: 'She _______ five books this year.',
                options: ['reads', 'is reading', 'has read', 'has been reading'],
                correctAnswer: 'has read',
                explanation: 'Sayılabilir tamamlanmış eylemler için Present Perfect (Simple).',
                difficulty: 'advanced'
            },
            {
                id: 39,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'They _______ (not/sleep) well recently.',
                options: ["don't sleep", "aren't sleeping", "haven't slept", "haven't been sleeping"],
                correctAnswer: "haven't been sleeping",
                explanation: '"Recently" ile devam eden süreç için Present Perfect Continuous.',
                difficulty: 'intermediate'
            },
            {
                id: 40,
                quizId: 4,
                type: 'multiple-choice',
                question: 'Who _______ my chocolate? The box is empty!',
                options: ['eats', 'is eating', 'has eaten', 'has been eating'],
                correctAnswer: 'has eaten',
                explanation: 'Tamamlanmış eylem + şimdiki sonuç için Present Perfect.',
                difficulty: 'intermediate'
            }
        ]
    },

    // 2. Past Tenses
    {
        topic: GrammarTopic.PastTenses,
        title: 'Past Tenses',
        description: 'Past Simple, Continuous, Perfect ve Perfect Continuous zamanlarını öğrenin',
        difficulty: 'intermediate',
        estimatedTime: 25,
        icon: '⏮️',
        color: '#2196F3',
        sections: [
            {
                type: 'theory',
                title: 'Genel Bakış',
                content: `Past Tenses (Geçmiş Zamanlar), geçmişte yaşanmış olayları farklı açılardan anlatmamızı sağlar.

### 1. Past Simple (Dili Geçmiş Zaman)
**Mantık**: Geçmişte belirli bir zamanda gerçekleşmiş ve **bitmiş** eylemler.
**Yapı**: Fiilin 2. hali (**V2**)
- **Kullanım**: "I watched a movie yesterday." (Dün izledim ve bitti).
- **Anahtar Kelimeler**: *yesterday, last night, two days ago, in 2010*.
> [!NOTE]
> **Düzensiz Fiiller**: *go -> went, see -> saw* gibi düzensiz halleri mutlaka ezberlemelisiniz!

### 2. Past Continuous (Sürekli Geçmiş Zaman)
**Mantık**: Geçmişte belirli bir anda devam eden veya başka bir eylemle bölünen olaylar.
**Yapı**: was/were + fiil-**ing**
- **Bölünme**: "I **was sleeping** when the phone rang." (Uyuyordum -uzun eylem-, telefon çaldı -kısa eylem-).
- **Paralel Eylem**: "While I **was cooking**, he **was reading**."

### 3. Past Perfect (Miş'li Geçmiş Zaman)
**Mantık**: "Geçmişin geçmişi". Geçmişte iki olay varsa, **daha önce olanı** anlatmak için kullanılır.
**Yapı**: had + **V3**
- **Örnek**: "When I arrived, the train **had left**." (Ben vardığımda tren çoktan gitmişti; yani trenin gitmesi benim varmamdan daha eski).

### 4. Past Perfect Continuous (Süreç Vurgulu Geçmişin Geçmişi)
**Mantık**: Geçmişteki bir noktadan önce başlayıp o noktaya kadar devam eden eylemin **süresini** vurgular.
**Yapı**: had + been + fiil-**ing**
- **Örnek**: "She was tired because she **had been working** all day." (Yorgun olduğu ana kadar tüm gün çalışıyordu).`
            },
            {
                type: 'examples',
                title: 'Örneklerle İnceleme',
                examples: [
                    {
                        sentence: 'I visited Paris in 2019.',
                        highlight: 'visited',
                        explanation: 'Past Simple - belirli bir zamanda tamamlanmış eylem (2019)'
                    },
                    {
                        sentence: 'While I was walking home, it started to rain.',
                        highlight: 'was walking',
                        explanation: 'Past Continuous - başka bir eylem tarafından bölünen arka plan eylemi'
                    },
                    {
                        sentence: 'When I arrived, the movie had already started.',
                        highlight: 'had started',
                        explanation: 'Past Perfect - başka bir geçmiş eylemden önce tamamlanmış eylem'
                    },
                    {
                        sentence: 'She was tired because she had been working all day.',
                        highlight: 'had been working',
                        explanation: 'Past Perfect Continuous - sonuca yol açan süreci vurgular (yorgun olmak)'
                    }
                ]
            },
            {
                type: 'tips',
                title: 'Sık Yapılan Hatalar',
                tips: [
                    '❌ Kısa, tamamlanmış eylemler için Past Continuous kullanmayın: "I was going there yesterday" → "I went there yesterday"',
                    '❌ Düzensiz geçmiş zaman hallerini unutmayın: "goed" → "went", "eated" → "ate"',
                    '✅ İki eş zamanlı eylem için Past Continuous kullanın: "While I was cooking, he was cleaning."',
                    '✅ Olay sırası önemliyse Past Perfect kullanın: "After I had eaten, I left."',
                    '✅ Zaman ifadeleri: yesterday, ago, last week/year, when I was young'
                ]
            }
        ],
        exercises: [
            {
                id: 41,
                quizId: 1,
                type: 'multiple-choice',
                question: 'I _______ to the cinema yesterday.',
                options: ['go', 'gone', 'went', 'was going'],
                correctAnswer: 'went',
                explanation: 'Tamamlanmış geçmiş zaman eylemleri için Past Simple kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 42,
                quizId: 1,
                type: 'fill-in-blank',
                question: 'She _______ (cook) dinner when the phone rang.',
                options: ['cooked', 'was cooking', 'had cooked', 'is cooking'],
                correctAnswer: 'was cooking',
                explanation: 'Geçmişte bir eylem devam ederken başka bir eylemin onu kesmesi (Past Continuous + Past Simple).',
                difficulty: 'beginner'
            },
            {
                id: 43,
                quizId: 1,
                type: 'multiple-choice',
                question: 'By the time we arrived, the movie _______.',
                options: ['started', 'was starting', 'had started', 'has started'],
                correctAnswer: 'had started',
                explanation: 'Geçmişteki bir andan veya eylemden daha önce gerçekleşmiş eylemler için Past Perfect kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 44,
                quizId: 1,
                type: 'fill-in-blank',
                question: 'She was exhausted because she _______ (run) for two hours.',
                options: ['ran', 'was running', 'had run', 'had been running'],
                correctAnswer: 'had been running',
                explanation: 'Geçmişteki bir sonuca (yorgunluk) yol açan eylemin süresini vurgulamak için Past Perfect Continuous kullanılır.',
                difficulty: 'advanced'
            },
            {
                id: 45,
                quizId: 1,
                type: 'multiple-choice',
                question: 'They _______ dinner when we arrived.',
                options: ['have', 'had', 'were having', 'had had'],
                correctAnswer: 'were having',
                explanation: 'Başka bir eylem gerçekleştiğinde devam etmekte olan eylem için Past Continuous kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 46,
                quizId: 1,
                type: 'multiple-choice',
                question: 'Before he _______ to bed, he had brushed his teeth.',
                options: ['go', 'goes', 'went', 'was going'],
                correctAnswer: 'went',
                explanation: 'Sıralı eylemlerde ikinci eylem için Past Simple kullanın. "Had brushed" (Past Perfect) önce oldu.',
                difficulty: 'intermediate'
            },
            {
                id: 47,
                quizId: 1,
                type: 'multiple-choice',
                question: 'At 9 PM last night, I _______ a book.',
                options: ['read', 'was reading', 'had read', 'have read'],
                correctAnswer: 'was reading',
                explanation: 'Geçmişte belirli bir anda devam etmekte olan eylem için Past Continuous kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 48,
                quizId: 1,
                type: 'fill-in-blank',
                question: 'I _______ (not/know) about the meeting until you told me.',
                options: ["didn't know", "wasn't knowing", "hadn't known", "haven't known"],
                correctAnswer: "didn't know",
                explanation: '"Know" gibi durum fiilleriyle Past Simple kullanın.',
                difficulty: 'intermediate'
            },
            {
                id: 49,
                quizId: 1,
                type: 'multiple-choice',
                question: 'We _______ in Izmir for five years before we moved to Istanbul.',
                options: ['lived', 'were living', 'had lived', 'have lived'],
                correctAnswer: 'had lived',
                explanation: 'Geçmişteki bir eylemden (moved) önce tamamlanmış bir süreci belirtmek için Past Perfect kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 50,
                quizId: 1,
                type: 'multiple-choice',
                question: 'When I was a child, I _______ every summer in my grandparents\' village.',
                options: ['spend', 'spent', 'was spending', 'had spent'],
                correctAnswer: 'spent',
                explanation: 'Geçmişteki alışkanlıklar ve tamamlanmış eylemler için Past Simple kullanılır.',
                difficulty: 'beginner'
            },

            // Quiz 2: Focus on Past Simple vs Continuous
            {
                id: 51,
                quizId: 2,
                type: 'multiple-choice',
                question: 'I _______ the letter and then I _______ it.',
                options: ['wrote/posted', 'was writing/posted', 'had written/posted', 'wrote/was posting'],
                correctAnswer: 'wrote/posted',
                explanation: 'Ardarda gelen tamamlanmış eylemler için Past Simple kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 52,
                quizId: 2,
                type: 'multiple-choice',
                question: 'What _______ you _______ (do) at this time yesterday?',
                options: ['did/do', 'were/doing', 'had/done', 'was/doing'],
                correctAnswer: 'were/doing',
                explanation: 'Geçmişte belirli bir andaki devam eden eylemi soruyoruz.',
                difficulty: 'beginner'
            },
            {
                id: 53,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'While I _______ (walk) down the street, I ran into an old friend.',
                options: ['walked', 'was walking', 'had walked', 'am walking'],
                correctAnswer: 'was walking',
                explanation: '"While" ile genellikle devam eden eylem (Past Continuous) kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 54,
                quizId: 2,
                type: 'multiple-choice',
                question: 'I _______ the window because it _______ (rain).',
                options: ['closed/was raining', 'was closing/rained', 'closed/rained', 'had closed/rained'],
                correctAnswer: 'closed/was raining',
                explanation: 'Yağmur yağdığı için (arka plan durumu) pencereyi kapattım (kısa eylem).',
                difficulty: 'intermediate'
            },
            {
                id: 55,
                quizId: 2,
                type: 'multiple-choice',
                question: 'I _______ to the radio when you rang.',
                options: ['listened', 'was listening', 'had listened', 'listen'],
                correctAnswer: 'was listening',
                explanation: 'Telefon çaldığında radyo dinliyordum. Past Continuous.',
                difficulty: 'beginner'
            },
            {
                id: 56,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'Yesterday at 6 PM, I _______ (not/study). I was sleeping.',
                options: ["didn't study", "wasn't studying", "hadn't studied", "wasn't study"],
                correctAnswer: "wasn't studying",
                explanation: 'Belirli bir zaman diliminde yapılmayan eylem. Past Continuous (negative).',
                difficulty: 'beginner'
            },
            {
                id: 57,
                quizId: 2,
                type: 'multiple-choice',
                question: 'The boys _______ (play) football when it started to rain.',
                options: ['played', 'were playing', 'had played', 'are playing'],
                correctAnswer: 'were playing',
                explanation: 'Yağmur başladığında maç devam ediyordu.',
                difficulty: 'beginner'
            },
            {
                id: 58,
                quizId: 2,
                type: 'multiple-choice',
                question: 'I _______ my homework and then went out.',
                options: ['finished', 'was finishing', 'had finished', 'finish'],
                correctAnswer: 'finished',
                explanation: 'Ardışık eylemler. Past Simple.',
                difficulty: 'beginner'
            },
            {
                id: 59,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'How fast _______ you _______ (drive) when the accident happened?',
                options: ['did/drive', 'were/driving', 'had/driven', 'was/driving'],
                correctAnswer: 'were/driving',
                explanation: 'Kaza anındaki hızı (devam eden durum) soruyoruz.',
                difficulty: 'intermediate'
            },
            {
                id: 60,
                quizId: 2,
                type: 'multiple-choice',
                question: 'I _______ for you but you weren\'t home.',
                options: ['called', 'was calling', 'had called', 'call'],
                correctAnswer: 'called',
                explanation: 'Tamamlanmış eylem. Past Simple.',
                difficulty: 'beginner'
            },

            // Quiz 3: Focus on Past Perfect vs Perfect Continuous
            {
                id: 61,
                quizId: 3,
                type: 'multiple-choice',
                question: 'The house was quiet when I got home. Everyone _______ to bed.',
                options: ['went', 'was going', 'had gone', 'had been going'],
                correctAnswer: 'had gone',
                explanation: 'Eve gelmemden önce gerçekleşmiş eylem. Past Perfect.',
                difficulty: 'intermediate'
            },
            {
                id: 62,
                quizId: 3,
                type: 'multiple-choice',
                question: 'We _______ for two hours when the bus finally arrived.',
                options: ['waited', 'were waiting', 'had waited', 'had been waiting'],
                correctAnswer: 'had been waiting',
                explanation: 'Otobüs gelmeden önceki bekleme sürecini vurguluyoruz. Past Perfect Continuous.',
                difficulty: 'intermediate'
            },
            {
                id: 63,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'When the teacher arrived, they _______ (talk) for ten minutes.',
                options: ['talked', 'were talking', 'had been talking', 'had talked'],
                correctAnswer: 'had been talking',
                explanation: 'Öğretmen gelmeden önceki konuşma süresi.',
                difficulty: 'intermediate'
            },
            {
                id: 64,
                quizId: 3,
                type: 'multiple-choice',
                question: 'I was sad because my dog _______ (die).',
                options: ['died', 'was dying', 'had died', 'had been dying'],
                correctAnswer: 'had died',
                explanation: 'Üzüntünün sebebi olan ve daha önce gerçekleşmiş eylem.',
                difficulty: 'intermediate'
            },
            {
                id: 65,
                quizId: 3,
                type: 'multiple-choice',
                question: 'I _______ that car for ten years before it broke down.',
                options: ['had', 'was having', 'had had', 'have had'],
                correctAnswer: 'had had',
                explanation: 'Bozulmadan önceki 10 yıllık sahiplik süreci. "Have" durum fiili olduğu için continuous olmaz, Past Perfect kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 66,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'His eyes were red because he _______ (cry).',
                options: ['cried', 'was crying', 'had been crying', 'had cried'],
                correctAnswer: 'had been crying',
                explanation: 'Geçmişteki bir sonucun (kızarık gözler) sebebi olan süregelen eylem.',
                difficulty: 'intermediate'
            },
            {
                id: 67,
                quizId: 3,
                type: 'multiple-choice',
                question: 'She _______ Italian before she moved to Rome.',
                options: ['studied', 'was studying', 'had studied', 'had been studying'],
                correctAnswer: 'had studied',
                explanation: 'Roma\'ya taşınmadan önce tamamlanmış veya süregelen eğitim.',
                difficulty: 'intermediate'
            },
            {
                id: 68,
                quizId: 3,
                type: 'multiple-choice',
                question: 'The grass was wet. It _______ (rain).',
                options: ['rained', 'was raining', 'had been raining', 'had rained'],
                correctAnswer: 'had been raining',
                explanation: 'Islaklığın sebebi olan bitmiş veya taze bitmiş eylem.',
                difficulty: 'intermediate'
            },
            {
                id: 69,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'I _______ (lose) my key, so I couldn\'t get into the house.',
                options: ['lost', 'was losing', 'had lost', 'had been losing'],
                correctAnswer: 'had lost',
                explanation: 'İçeri girememenin sebebi olan ve daha önce gerçekleşmiş eylem.',
                difficulty: 'intermediate'
            },
            {
                id: 70,
                quizId: 3,
                type: 'multiple-choice',
                question: 'How long _______ you _______ (study) before you took the test?',
                options: ['did/study', 'were/studying', 'had/been studying', 'had/studied'],
                correctAnswer: 'had/been studying',
                explanation: 'Testten önceki çalışma süresini soruyoruz.',
                difficulty: 'advanced'
            },

            // Quiz 4: Mixed Past Tenses
            {
                id: 71,
                quizId: 4,
                type: 'multiple-choice',
                question: 'When I _______ (arrive) at the party, Paul _______ (already/go) home.',
                options: ['arrived/already went', 'arrived/had already gone', 'was arriving/already went', 'had arrived/already went'],
                correctAnswer: 'arrived/had already gone',
                explanation: 'Vardığımda (Past Simple) Paul çoktan gitmişti (Past Perfect).',
                difficulty: 'intermediate'
            },
            {
                id: 72,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'I _______ (walk) home when I saw an old friend.',
                options: ['walked', 'was walking', 'had walked', 'walk'],
                correctAnswer: 'was walking',
                explanation: 'Eve yürürken (devam eden eylem) arkadaşı gördüm (kısa eylem).',
                difficulty: 'beginner'
            },
            {
                id: 73,
                quizId: 4,
                type: 'multiple-choice',
                question: 'Yesterday, I _______ (wake) up, _______ (have) breakfast and _______ (go) to work.',
                options: ['woke/had/went', 'was waking/had/went', 'had woken/had/went', 'woke/was having/went'],
                correctAnswer: 'woke/had/went',
                explanation: 'Sırayla yapılan eylemler. Hepsi Past Simple.',
                difficulty: 'beginner'
            },
            {
                id: 74,
                quizId: 4,
                type: 'multiple-choice',
                question: 'I _______ you but you _______.',
                options: ['was calling/didn\'t answer', 'called/didn\'t answer', 'had called/weren\'t answering', 'called/wasn\'t answering'],
                correctAnswer: 'called/didn\'t answer',
                explanation: 'Tamamlanmış iki kısa eylem.',
                difficulty: 'beginner'
            },
            {
                id: 75,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'The film _______ (already/start) when we got to the cinema.',
                options: ['already started', 'had already started', 'was already starting', 'already starts'],
                correctAnswer: 'had already started',
                explanation: 'Varmamızdan önce başlamıştı. Past Perfect.',
                difficulty: 'intermediate'
            },
            {
                id: 76,
                quizId: 4,
                type: 'multiple-choice',
                question: 'He _______ (work) in that company for twenty years when he retired.',
                options: ['worked', 'was working', 'had been working', 'had worked'],
                correctAnswer: 'had been working',
                explanation: 'Emekli olmadan önceki 20 yıllık süreci vurguluyoruz.',
                difficulty: 'intermediate'
            },
            {
                id: 77,
                quizId: 4,
                type: 'multiple-choice',
                question: 'I _______ (not/realize) that I _______ (lose) my wallet.',
                options: ['didn\'t realize/lost', 'didn\'t realize/had lost', 'hadn\'t realized/lost', 'wasn\'t realizing/had lost'],
                correctAnswer: 'didn\'t realize/had lost',
                explanation: 'Fark etmedim (Past Simple) ama daha önce kaybetmiştim (Past Perfect).',
                difficulty: 'intermediate'
            },
            {
                id: 78,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'While they _______ (wait) for the bus, they _______ (hear) a loud noise.',
                options: ['waited/heard', 'were waiting/heard', 'had been waiting/heard', 'were waiting/were hearing'],
                correctAnswer: 'were waiting/heard',
                explanation: 'Bekleme süresince (Past Continuous) sesi duydular (Past Simple).',
                difficulty: 'beginner'
            },
            {
                id: 79,
                quizId: 4,
                type: 'multiple-choice',
                question: 'I _______ (never/see) such a beautiful sunset before I went to Bali.',
                options: ['never saw', 'had never seen', 'was never seeing', 'never see'],
                correctAnswer: 'had never seen',
                explanation: 'Bali\'ye gitmeden (geçmişteki bir an) öncesine dair deneyim.',
                difficulty: 'intermediate'
            },
            {
                id: 80,
                quizId: 4,
                type: 'multiple-choice',
                question: 'When I opened the curtains, I saw that it _______ (snow).',
                options: ['snowed', 'was snowing', 'had snowed', 'had been snowing'],
                correctAnswer: 'had snowed',
                explanation: 'Perdeyi açtığımda (Past Simple) karın çoktan yağmış ve bitmiş olduğunu gördüm (veya yerler beyazdı). Past Perfect.',
                difficulty: 'intermediate'
            }
        ]
    },

    // 3. Future Forms
    {
        topic: GrammarTopic.FutureForms,
        title: 'Future Forms',
        description: 'Gelecek zaman için will, going to ve Present Continuous kullanımı',
        difficulty: 'intermediate',
        estimatedTime: 20,
        icon: '⏭️',
        color: '#9C27B0',
        sections: [
            {
                type: 'theory',
                title: 'Genel Bakış',
                content: `Gelecekten bahsetmek için birden fazla yapı vardır. Hangisini seçeceğiniz, geleceğe bakış açınıza bağlıdır.

### 1. Will (Gelecek Zaman)
**Mantık**: Anlık kararlar, tahminler, sözler ve teklifler.
**Yapı**: will + yalın fiil
- **Anlık Karar**: "The phone is ringing. I **will** answer it." (Şu an karar verdim).
- **Tahmin**: "I think it **will** rain tomorrow." (Kişisel görüş).
- **Söz**: "I **will** help you."

### 2. Be Going To (Planlanan Gelecek)
**Mantık**: Önceden kararlaştırılmış planlar veya eldeki bir kanıta dayalı tahminler.
**Yapı**: am/is/are + going to + yalın fiil
- **Plan**: "I **am going to** visit my grandparents this weekend." (Kararım önceden belli).
- **Kanıt**: "Look at the dark clouds! It **is going to** rain." (Bulutları görüyorum, kanıtım var).

### 3. Present Continuous (Kesin Randevular)
**Mantık**: Zamanı ve yeri belli, başkalarıyla ayarlanmış kesin olaylar.
- **Örnek**: "I **am meeting** the doctor at 3 PM tomorrow." (Randevum var, kesinleşmiş).

### 4. Present Simple (Zaman Çizelgeleri)
**Mantık**: Tren, uçak, sinema gibi herkes için geçerli sabit programlar.
- **Örnek**: "The movie **starts** at 8 PM."`
            },
            {
                type: 'examples',
                title: 'Gelecek Formlarının Karşılaştırması',
                examples: [
                    {
                        sentence: 'I\'ll call you later.',
                        highlight: 'will call',
                        explanation: 'Konuşma anında verilen anlık karar'
                    },
                    {
                        sentence: 'I\'m going to call my mother this evening.',
                        highlight: 'going to call',
                        explanation: 'Konuşmadan önce kararlaştırılmış plan/niyet'
                    },
                    {
                        sentence: 'I\'m calling the doctor tomorrow morning.',
                        highlight: 'am calling',
                        explanation: 'Kesinleşmiş randevu/ayarlama'
                    },
                    {
                        sentence: 'Look at those dark clouds! It\'s going to rain.',
                        highlight: 'going to rain',
                        explanation: 'Mevcut kanıta dayalı tahmin (bulutlar)'
                    }
                ]
            },
            {
                type: 'tips',
                title: 'Sık Yapılan Hatalar',
                tips: [
                    '❌ Önceden planlanmış eylemler için "will" kullanmayın: "Tomorrow I will meet John" → "...I\'m meeting John"',
                    '❌ Anlık kararlar için "going to" kullanmayın: "Wait! I\'m going to help you!" → "...I\'ll help you!"',
                    '✅ Kanıtı görebildiğinizde "going to" kullanın: "She\'s going to have a baby." (hamile olduğunu görebiliyorsun)',
                    '✅ Zaman ifadeleri: tomorrow, next week, in a few days, later, soon',
                    '✅ "When", "if", "before", "after" bağlaçlarından sonra "will" değil, Present Simple kullanın: "When I arrive, I\'ll call you."'
                ]
            }
        ],
        exercises: [
            {
                id: 81,
                quizId: 1,
                type: 'multiple-choice',
                question: 'Wait! I _______ help you with those bags.',
                options: ['will', 'am going to', 'am helping', 'help'],
                correctAnswer: 'will',
                explanation: 'Konuşma anında verilen anlık kararlar için "will" kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 82,
                quizId: 1,
                type: 'multiple-choice',
                question: 'We _______ get married next June.',
                options: ['will', 'are going to', 'are', 'going to'],
                correctAnswer: 'are going to',
                explanation: 'Önceden kararlaştırılan planlar için "going to" kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 83,
                quizId: 1,
                type: 'multiple-choice',
                question: 'I _______ the dentist at 3 PM tomorrow.',
                options: ['will see', 'am going to see', 'am seeing', 'see'],
                correctAnswer: 'am seeing',
                explanation: 'Belirli zamanlı kesin randevular için Present Continuous kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 84,
                quizId: 1,
                type: 'multiple-choice',
                question: 'Look at those dark clouds! It _______.',
                options: ['will rain', 'is going to rain', 'is raining', 'rains'],
                correctAnswer: 'is going to rain',
                explanation: 'Mevcut kanıta dayalı tahminler için "going to" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 85,
                quizId: 1,
                type: 'multiple-choice',
                question: 'The train _______ at 6:30 PM.',
                options: ['will leave', 'is going to leave', 'is leaving', 'leaves'],
                correctAnswer: 'leaves',
                explanation: 'Zaman çizelgeleri için Present Simple kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 86,
                quizId: 1,
                type: 'multiple-choice',
                question: 'A: "We don\'t have any milk." B: "Don\'t worry. I _______ some."',
                options: ['will buy', 'am going to buy', 'am buying', 'buy'],
                correctAnswer: 'will buy',
                explanation: 'Anlık kararlar için "will" kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 87,
                quizId: 1,
                type: 'multiple-choice',
                question: 'I think Manchester _______ the match.',
                options: ['will win', 'is going to win', 'is winning', 'wins'],
                correctAnswer: 'will win',
                explanation: 'Fikir veya inanca dayalı tahminler için "will" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 88,
                quizId: 1,
                type: 'fill-in-blank',
                question: 'She has bought a lot of books. She _______ (start) studying seriously.',
                options: ['will start', 'is going to start', 'is starting', 'starts'],
                correctAnswer: 'is going to start',
                explanation: 'Mevcut kanıta dayalı niyetler için "going to" kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 89,
                quizId: 1,
                type: 'fill-in-blank',
                question: 'This time next week, I _______ (lie) on a beach in Spain.',
                options: ['will lie', 'will be lying', 'am going to lie', 'am lying'],
                correctAnswer: 'will be lying',
                explanation: 'Gelecekte belirli bir zamanda devam edecek eylemler için Future Continuous kullanılır.',
                difficulty: 'advanced'
            },
            {
                id: 90,
                quizId: 1,
                type: 'error-correction',
                question: 'When I will arrive home, I will call you.',
                correctAnswer: 'When I arrive home, I will call you.',
                explanation: 'Zaman bağlaçlarından sonra "will" kullanılmaz, Present Simple kullanılır.',
                difficulty: 'intermediate'
            },

            // Quiz 2: Focus on Will vs Going to
            {
                id: 91,
                quizId: 2,
                type: 'multiple-choice',
                question: 'A: "Why are you holding a bucket of water?" B: "I _______ the car."',
                options: ['will wash', 'am going to wash', 'wash', 'am washing'],
                correctAnswer: 'am going to wash',
                explanation: 'Önceden verilmiş bir karar (kova hazır). "Be going to" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 92,
                quizId: 2,
                type: 'multiple-choice',
                question: 'A: "I\'m cold." B: "I _______ the window."',
                options: ['am going to close', 'will close', 'close', 'am closing'],
                correctAnswer: 'will close',
                explanation: 'Konuşma anında verilen anlık karar. "Will" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 93,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'I _______ (meet) my friend for lunch tomorrow. We arranged it yesterday.',
                options: ['will meet', 'am meeting', 'meet', 'have met'],
                correctAnswer: 'am meeting',
                explanation: 'Ayarlanmış kesin randevu. Present Continuous.',
                difficulty: 'intermediate'
            },
            {
                id: 94,
                quizId: 2,
                type: 'multiple-choice',
                question: 'I promise I _______ (not/tell) anyone your secret.',
                options: ['won\'t tell', 'am not going to tell', 'don\'t tell', 'not tell'],
                correctAnswer: 'won\'t tell',
                explanation: 'Sözler için "will" (veya won\'t) kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 95,
                quizId: 2,
                type: 'multiple-choice',
                question: 'Watch out! You _______ (drop) those glasses!',
                options: ['will drop', 'are going to drop', 'drop', 'are dropping'],
                correctAnswer: 'are going to drop',
                explanation: 'Gözle görülür bir kanıta dayalı tahmin (be going to).',
                difficulty: 'beginner'
            },
            {
                id: 96,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'The plane _______ (arrive) at 10 AM tomorrow.',
                options: ['will arrive', 'is going to arrive', 'arrives', 'is arriving'],
                correctAnswer: 'arrives',
                explanation: 'Tarifeli uçuşlar için Present Simple.',
                difficulty: 'intermediate'
            },
            {
                id: 97,
                quizId: 2,
                type: 'multiple-choice',
                question: 'I _______ (travel) to Europe this summer. I\'ve already bought my tickets.',
                options: ['will travel', 'am travelling', 'travel', 'travelling'],
                correctAnswer: 'am travelling',
                explanation: 'Bilet alınmış, kesinleşmiş plan. Present Continuous.',
                difficulty: 'intermediate'
            },
            {
                id: 98,
                quizId: 2,
                type: 'multiple-choice',
                question: 'I think the world _______ (be) a better place in the future.',
                options: ['will be', 'is going to be', 'is', 'be'],
                correctAnswer: 'will be',
                explanation: 'Kişisel tahmin. "Will".',
                difficulty: 'beginner'
            },
            {
                id: 99,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'Wait! Don\'t go. I _______ (give) you a lift.',
                options: ['will give', 'am going to give', 'give', 'am giving'],
                correctAnswer: 'will give',
                explanation: 'Anlık teklif/tepki. "Will".',
                difficulty: 'beginner'
            },
            {
                id: 100,
                quizId: 2,
                type: 'multiple-choice',
                question: 'Are you _______ (go) to the party tonight?',
                options: ['go', 'going', 'will go', 'gone'],
                correctAnswer: 'going',
                explanation: 'Yakın gelecek planı sorusu. Present Continuous.',
                difficulty: 'beginner'
            },

            // Quiz 3: Future Continuous & Future Perfect
            {
                id: 101,
                quizId: 3,
                type: 'multiple-choice',
                question: 'By next Christmas, I _______ (live) here for ten years.',
                options: ['will live', 'will have lived', 'will be living', 'living'],
                correctAnswer: 'will have lived',
                explanation: 'Gelecekte belirli bir andan önce tamamlanmış olacak eylem. Future Perfect.',
                difficulty: 'advanced'
            },
            {
                id: 102,
                quizId: 3,
                type: 'multiple-choice',
                question: 'Don\'t phone me between 7 and 8. We _______ (have) dinner then.',
                options: ['will have', 'will be having', 'will have had', 'are having'],
                correctAnswer: 'will be having',
                explanation: 'Gelecekte belirli bir zamanda devam ediyor olacak eylem. Future Continuous.',
                difficulty: 'intermediate'
            },
            {
                id: 103,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'By the time you get this letter, I _______ (leave) for New York.',
                options: ['will leave', 'will be leaving', 'will have left', 'leave'],
                correctAnswer: 'will have left',
                explanation: 'Gelecekte bir eylemden önce tamamlanmış olacak eylem. Future Perfect.',
                difficulty: 'advanced'
            },
            {
                id: 104,
                quizId: 3,
                type: 'multiple-choice',
                question: 'If you need me, I _______ (be) in the library.',
                options: ['will be', 'am being', 'have been', 'am going to be'],
                correctAnswer: 'will be',
                explanation: 'Bilgi verme/tahmin. "Will".',
                difficulty: 'beginner'
            },
            {
                id: 105,
                quizId: 3,
                type: 'multiple-choice',
                question: '_______ you _______ (use) your car this evening? Can I borrow it?',
                options: ['Will...use', 'Will...be using', 'Are...going to use', 'Do...use'],
                correctAnswer: 'Will...be using',
                explanation: 'Birinden bir nezaket ricası öncesi planını sormak için Future Continuous sık kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 106,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'I hope I _______ (finish) my work by 9 PM.',
                options: ['will finish', 'will have finished', 'will be finishing', 'finish'],
                correctAnswer: 'will have finished',
                explanation: 'Belirli bir saate kadar tamamlanmış olma beklentisi. Future Perfect.',
                difficulty: 'advanced'
            },
            {
                id: 107,
                quizId: 3,
                type: 'multiple-choice',
                question: 'This time tomorrow, we _______ (sit) the exam.',
                options: ['will sit', 'will be sitting', 'will have sat', 'sit'],
                correctAnswer: 'will be sitting',
                explanation: 'Gelecekteki o anda sınavın ortasında olacağız.',
                difficulty: 'intermediate'
            },
            {
                id: 108,
                quizId: 3,
                type: 'multiple-choice',
                question: 'They _______ (not/complete) the project by the deadline.',
                options: ['won\'t complete', 'won\'t be completing', 'won\'t have completed', 'aren\'t completing'],
                correctAnswer: 'won\'t have completed',
                explanation: 'Mühletten önce tamamlanmış olmayacak. Future Perfect.',
                difficulty: 'advanced'
            },
            {
                id: 109,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'I _______ (see) you tonight, then.',
                options: ['will be seeing', 'will have seen', 'see', 'am seeing'],
                correctAnswer: 'will be seeing',
                explanation: 'Olağan bir gelecek eylemi vurgusu için Future Continuous kullanılabilir.',
                difficulty: 'intermediate'
            },
            {
                id: 110,
                quizId: 3,
                type: 'multiple-choice',
                question: 'He _______ (spend) all his money before he finds a job.',
                options: ['will spend', 'will be spending', 'will have spent', 'spends'],
                correctAnswer: 'will have spent',
                explanation: 'Gelecekteki bir andan (iş bulmadan) önce gerçekleşmiş olacak eylem.',
                difficulty: 'advanced'
            },

            // Quiz 4: Mixed Future Tenses
            {
                id: 111,
                quizId: 4,
                type: 'multiple-choice',
                question: 'Call me as soon as you _______ (get) there.',
                options: ['will get', 'get', 'are getting', 'will have got'],
                correctAnswer: 'get',
                explanation: 'Zaman bağlaçlarından (as soon as) sonra Present Simple kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 112,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'Look at the scores! Germany _______ (win) the match.',
                options: ['will win', 'is going to win', 'is winning', 'wins'],
                correctAnswer: 'is going to win',
                explanation: 'Gözle görülür kanıt (skor tablosu). "Be going to".',
                difficulty: 'beginner'
            },
            {
                id: 113,
                quizId: 4,
                type: 'multiple-choice',
                question: 'I _______ (certainly/be) there on time.',
                options: ['will certainly be', 'am certainly going to be', 'am certainly being', 'certainly am'],
                correctAnswer: 'will certainly be',
                explanation: '"Certainly" gibi zarflar genellikle "will" ile kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 114,
                quizId: 4,
                type: 'multiple-choice',
                question: 'What time _______ the shops _______ (close) in England?',
                options: ['will...close', 'are...closing', 'do...close', 'are...going to close'],
                correctAnswer: 'do...close',
                explanation: 'Genele hitap eden zaman çizelgeleri. Present Simple.',
                difficulty: 'intermediate'
            },
            {
                id: 115,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'By the time she retires, she _______ (work) for 40 years.',
                options: ['will work', 'will be working', 'will have worked', 'will have been working'],
                correctAnswer: 'will have worked',
                explanation: 'Eylemin gelecekteki bir andan önce tamamlanmış olma durumu.',
                difficulty: 'advanced'
            },
            {
                id: 116,
                quizId: 4,
                type: 'multiple-choice',
                question: 'A: "The tea is ready." B: "I _______ (have) a cup, then."',
                options: ['am going to have', 'will have', 'have', 'am having'],
                correctAnswer: 'will have',
                explanation: 'Anlık karar. "Will".',
                difficulty: 'beginner'
            },
            {
                id: 117,
                quizId: 4,
                type: 'multiple-choice',
                question: 'I _______ (start) my new job on Monday morning.',
                options: ['will start', 'am starting', 'start', 'have started'],
                correctAnswer: 'am starting',
                explanation: 'Kesinleşmiş yeni bir durum/ayarlama. Present Continuous.',
                difficulty: 'intermediate'
            },
            {
                id: 118,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'If it _______ (snow) tomorrow, we won\'t go skiing.',
                options: ['will snow', 'snows', 'is going to snow', 'is snowing'],
                correctAnswer: 'snows',
                explanation: 'If cümleciğinde gelecek zaman için Present Simple kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 119,
                quizId: 4,
                type: 'multiple-choice',
                question: 'I think you _______ (enjoy) the film.',
                options: ['will enjoy', 'are going to enjoy', 'are enjoying', 'enjoy'],
                correctAnswer: 'will enjoy',
                explanation: 'Kişisel fikir. "Will".',
                difficulty: 'beginner'
            },
            {
                id: 120,
                quizId: 4,
                type: 'multiple-choice',
                question: 'Scientists say that the planet _______ (get) even warmer.',
                options: ['gets', 'is getting', 'will get', 'had got'],
                correctAnswer: 'will get',
                explanation: 'Bilimsel tahmin/öngörü. "Will".',
                difficulty: 'intermediate'
            }
        ]
    }
    ,

    // 4. Modal Verbs
    {
        topic: GrammarTopic.ModalVerbs,
        title: 'Modal Verbs',
        description: 'Can, could, should, must, have to, may, might kullanımlarını öğrenin',
        difficulty: 'intermediate',
        estimatedTime: 22,
        icon: '🔑',
        color: '#FF9800',
        sections: [
            {
                type: 'theory',
                title: 'Genel Bakış',
                content: `Modal Verbs (Kip Belirteçleri), ana fiile "olasılık, zorunluluk, izin" gibi anlamlar katar.

> [!IMPORTANT]
> **Altın Kural**: Modallardan sonra her zaman fiilin **yalın hali** gelir. (He can *swim* - *swims* değil).

### 1. Yetenek (Ability)
- **Can**: Şu anki yetenek. "I **can** speak English."
- **Could**: Geçmişteki yetenek. "I **could** run fast when I was a child."

### 2. Zorunluluk (Obligation)
- **Must**: Kişisel zorunluluk veya güçlü tavsiye. "I **must** study." (Bence gerekli).
- **Have to**: Dışarıdan gelen zorunluluk (kurallar). "I **have to** wear a uniform at work."
> [!WARNING]
> **Zıt Anlam Farkı**:
> - **Mustn't**: Yasak! (Yapmamalısın).
> - **Don't have to**: Zorunlu değil (Yapmana gerek yok ama istersen yapabilirsin).

### 3. Tavsiye (Advice)
- **Should**: "You **should** eat more vegetables." (Öneri).

### 4. İhtimal (Possibility)
- **May / Might / Could**: Belki anlamı katar. "It **might** rain later." (%50 ihtimal).`
            },
            {
                type: 'examples',
                title: 'Örneklerle İnceleme',
                examples: [
                    { sentence: 'She can speak five languages.', highlight: 'can speak', explanation: 'Şimdiki zamanda yetenek' },
                    { sentence: 'You should see a doctor.', highlight: 'should see', explanation: 'Tavsiye verme' },
                    { sentence: 'I must finish this today.', highlight: 'must finish', explanation: 'Güçlü kişisel zorunluluk' },
                    { sentence: 'It might rain later.', highlight: 'might rain', explanation: 'İhtimal ("may"den daha düşük)' }
                ]
            },
            {
                type: 'tips',
                title: 'Sık Yapılan Hatalar',
                tips: [
                    '❌ Modallardan sonra "to" eklemeyin: "I must to go" → "I must go"',
                    '❌ Üçüncü tekil şahıs için "s" eklemeyin: "He cans swim" → "He can swim"',
                    '✅ Geçmiş zamandaki soru ve olumsuzlarda (must değil) "have to" kullanın: "Did you have to wait?"',
                    '✅ "Mustn\'t" = yasak, "Don\'t have to" = zorunluluk yok'
                ]
            }
        ],
        exercises: [
            {
                id: 121,
                quizId: 1,
                type: 'multiple-choice',
                question: 'She _______ speak three languages.',
                options: ['can', 'cans', 'can to', 'is can'],
                correctAnswer: 'can',
                explanation: 'Modallardan sonra "to" veya "s" olmadan "can" kullanın.',
                difficulty: 'beginner'
            },
            {
                id: 122,
                quizId: 1,
                type: 'multiple-choice',
                question: 'You _______ see a doctor about that cough.',
                options: ['should', 'must', 'can', 'may'],
                correctAnswer: 'should',
                explanation: 'Tavsiye veya öneri vermek için "should" kullanın.',
                difficulty: 'beginner'
            },
            {
                id: 123,
                quizId: 1,
                type: 'multiple-choice',
                question: 'Students _______ wear uniforms at this school. It\'s a rule.',
                options: ['should', 'could', 'have to', 'may'],
                correctAnswer: 'have to',
                explanation: 'Dış kurallar ve zorunluluklar için "have to" kullanın.',
                difficulty: 'intermediate'
            },
            {
                id: 124,
                quizId: 1,
                type: 'multiple-choice',
                question: 'It _______ rain tomorrow. The forecast is uncertain.',
                options: ['must', 'should', 'might', 'has to'],
                correctAnswer: 'might',
                explanation: 'Belirsiz ihtimaller için "might" kullanın.',
                difficulty: 'intermediate'
            },
            {
                id: 125,
                quizId: 1,
                type: 'error-correction',
                question: 'He must to finish his homework before going out.',
                correctAnswer: 'He must finish his homework before going out.',
                explanation: 'Modal fiillerden sonra "to" kullanmayın.',
                difficulty: 'beginner'
            },
            {
                id: 126,
                quizId: 1,
                type: 'multiple-choice',
                question: 'You _______ smoke here. It\'s forbidden.',
                options: ['don\'t have to', 'mustn\'t', 'shouldn\'t', 'can\'t to'],
                correctAnswer: 'mustn\'t',
                explanation: 'Yasaklar için "mustn\'t" kullanın.',
                difficulty: 'intermediate'
            },
            {
                id: 127,
                quizId: 1,
                type: 'multiple-choice',
                question: 'You _______ come to the party if you don\'t want to.',
                options: ['mustn\'t', 'don\'t have to', 'can\'t', 'shouldn\'t'],
                correctAnswer: 'don\'t have to',
                explanation: 'Zorunluluk olmadığını belirtmek için "don\'t have to" kullanın.',
                difficulty: 'intermediate'
            },
            {
                id: 128,
                quizId: 1,
                type: 'multiple-choice',
                question: '_______ I use your phone?',
                options: ['Should', 'Must', 'May', 'Have to'],
                correctAnswer: 'May',
                explanation: 'İzin istemek için "may" veya "can" kullanın.',
                difficulty: 'beginner'
            },
            {
                id: 129,
                quizId: 1,
                type: 'multiple-choice',
                question: 'When I was young, I _______ run very fast.',
                options: ['can', 'could', 'should', 'might'],
                correctAnswer: 'could',
                explanation: 'Geçmişteki yetenekler için "could" kullanın.',
                difficulty: 'beginner'
            },
            {
                id: 130,
                quizId: 1,
                type: 'fill-in-blank',
                question: 'I _______ (go) to the doctor yesterday because I was sick.',
                options: ['must go', 'had to go', 'should go', 'have to go'],
                correctAnswer: 'had to go',
                explanation: 'Geçmiş zorunluluklar için "had to" kullanın.',
                difficulty: 'intermediate'
            },

            // Quiz 2: Focus on Permisson & Advice
            {
                id: 131,
                quizId: 2,
                type: 'multiple-choice',
                question: '_______ you help me with this heavy box, please?',
                options: ['Should', 'Can', 'Must', 'May'],
                correctAnswer: 'Can',
                explanation: 'Rica ve yardım istemek için "Can" veya "Could" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 132,
                quizId: 2,
                type: 'multiple-choice',
                question: 'It\'s late. You _______ go to bed.',
                options: ['should', 'may', 'can', 'could'],
                correctAnswer: 'should',
                explanation: 'Tavsiye için "should" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 133,
                quizId: 2,
                type: 'fill-in-blank',
                question: '_______ I borrow your pen for a moment?',
                options: ['Must', 'Can', 'Should', 'Have to'],
                correctAnswer: 'Can',
                explanation: 'İzin isteme. "Can" yaygın bir kullanımdır.',
                difficulty: 'beginner'
            },
            {
                id: 134,
                quizId: 2,
                type: 'multiple-choice',
                question: 'You _______ (not) eat so much junk food. It\'s bad for you.',
                options: ['shouldn\'t', 'mustn\'t', 'can\'t', 'don\'t have to'],
                correctAnswer: 'shouldn\'t',
                explanation: 'Yapılması tavsiye edilmeyen şeyler için "shouldn\'t" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 135,
                quizId: 2,
                type: 'multiple-choice',
                question: '_______ we go to the cinema tonight? What do you think?',
                options: ['Shall', 'Must', 'Have to', 'Should'],
                correctAnswer: 'Shall',
                explanation: 'Öneri ve tekliflerde "I" ve "We" ile "Shall" kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 136,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'You _______ (look) after your health.',
                options: ['should', 'may', 'might', 'can'],
                correctAnswer: 'should',
                explanation: 'Güçlü tavsiye.',
                difficulty: 'beginner'
            },
            {
                id: 137,
                quizId: 2,
                type: 'multiple-choice',
                question: 'I _______ speak English when I was five.',
                options: ['can', 'could', 'was can', 'should'],
                correctAnswer: 'could',
                explanation: 'Geçmiş yetenek.',
                difficulty: 'beginner'
            },
            {
                id: 138,
                quizId: 2,
                type: 'multiple-choice',
                question: '_______ I open the window?',
                options: ['Shall', 'Must', 'Should', 'Have to'],
                correctAnswer: 'Shall',
                explanation: 'Teklif/öneri.',
                difficulty: 'intermediate'
            },
            {
                id: 139,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'He _______ (be) at home now. I saw his car.',
                options: ['must be', 'should be', 'can be', 'might be'],
                correctAnswer: 'must be',
                explanation: 'Eldeki kanıta dayalı güçlü çıkarım.',
                difficulty: 'intermediate'
            },
            {
                id: 140,
                quizId: 2,
                type: 'multiple-choice',
                question: 'You _______ (not) shout. The baby is sleeping.',
                options: ['mustn\'t', 'shouldn\'t', 'don\'t have to', 'can\'t'],
                correctAnswer: 'shouldn\'t',
                explanation: 'Tavsiye/gereklilik (negatif).',
                difficulty: 'beginner'
            },

            // Quiz 3: Focus on Obligation & Necessity
            {
                id: 141,
                quizId: 3,
                type: 'multiple-choice',
                question: 'You _______ have a passport to travel abroad.',
                options: ['must', 'have to', 'should', 'can'],
                correctAnswer: 'must',
                explanation: 'Güçlü zorunluluk.',
                difficulty: 'beginner'
            },
            {
                id: 142,
                quizId: 3,
                type: 'multiple-choice',
                question: 'I _______ work on Saturdays. It\'s part of my job.',
                options: ['must', 'have to', 'should', 'may'],
                correctAnswer: 'have to',
                explanation: 'Dış kurallardan kaynaklanan zorunluluk.',
                difficulty: 'intermediate'
            },
            {
                id: 143,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'We _______ (get) up early tomorrow. The flight is at 6 AM.',
                options: ['must', 'have to', 'should', 'could'],
                correctAnswer: 'have to',
                explanation: 'Gereklilik/zorunluluk.',
                difficulty: 'intermediate'
            },
            {
                id: 144,
                quizId: 3,
                type: 'multiple-choice',
                question: 'You _______ wear a seatbelt when you drive.',
                options: ['must', 'should', 'may', 'could'],
                correctAnswer: 'must',
                explanation: 'Yasal zorunluluk.',
                difficulty: 'beginner'
            },
            {
                id: 145,
                quizId: 3,
                type: 'multiple-choice',
                question: 'She _______ (not) work yesterday. It\'s a holiday.',
                options: ['didn\'t have to', 'mustn\'t', 'shouldn\'t', 'couldn\'t'],
                correctAnswer: 'didn\'t have to',
                explanation: 'Geçmişte zorunluluk olmaması durumu.',
                difficulty: 'intermediate'
            },
            {
                id: 146,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'I _______ (finish) this report by tonight.',
                options: ['must', 'have to', 'should', 'can'],
                correctAnswer: 'must',
                explanation: 'Kişisel zorunluluk.',
                difficulty: 'intermediate'
            },
            {
                id: 147,
                quizId: 3,
                type: 'multiple-choice',
                question: 'Drivers _______ stop at a red light.',
                options: ['must', 'should', 'may', 'can'],
                correctAnswer: 'must',
                explanation: 'Kural/kanun.',
                difficulty: 'beginner'
            },
            {
                id: 148,
                quizId: 3,
                type: 'multiple-choice',
                question: 'Do you _______ wear a tie at work?',
                options: ['must', 'have to', 'should', 'could'],
                correctAnswer: 'have to',
                explanation: 'Soru formunda "must" yerine genellikle "have to" kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 149,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'You _______ (not) tell anyone. It\'s a secret.',
                options: ['mustn\'t', 'don\'t have to', 'shouldn\'t', 'can\'t'],
                correctAnswer: 'mustn\'t',
                explanation: 'Yasak/güçlü olumsuz tavsiye.',
                difficulty: 'beginner'
            },
            {
                id: 150,
                quizId: 3,
                type: 'multiple-choice',
                question: 'He _______ (not) go to school tomorrow. It\'s Sunday.',
                options: ['doesn\'t have to', 'mustn\'t', 'shouldn\'t', 'isn\'t'],
                correctAnswer: 'doesn\'t have to',
                explanation: 'Zorunluluk olmama durumu.',
                difficulty: 'beginner'
            },

            // Quiz 4: Mixed Modal Verbs
            {
                id: 151,
                quizId: 4,
                type: 'multiple-choice',
                question: 'I _______ swim when I was 4 years old.',
                options: ['can', 'could', 'should', 'must'],
                correctAnswer: 'could',
                explanation: 'Geçmiş yetenek.',
                difficulty: 'beginner'
            },
            {
                id: 152,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'They _______ (be) at the park. I\'m not sure.',
                options: ['must be', 'might be', 'should be', 'have to be'],
                correctAnswer: 'might be',
                explanation: 'Belirsiz ihtimal.',
                difficulty: 'intermediate'
            },
            {
                id: 153,
                quizId: 4,
                type: 'multiple-choice',
                question: 'You _______ touch that. It\'s very hot!',
                options: ['mustn\'t', 'don\'t have to', 'shouldn\'t', 'can\'t'],
                correctAnswer: 'mustn\'t',
                explanation: 'Yasak/tehlike bildirimi.',
                difficulty: 'beginner'
            },
            {
                id: 154,
                quizId: 4,
                type: 'multiple-choice',
                question: '_______ you like some coffee?',
                options: ['Will', 'Would', 'Can', 'Should'],
                correctAnswer: 'Would',
                explanation: 'Teklif/istek kalıbı.',
                difficulty: 'beginner'
            },
            {
                id: 155,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'I _______ (study) harder if I want to pass the exam.',
                options: ['should', 'may', 'could', 'shall'],
                correctAnswer: 'should',
                explanation: 'Tavsiye.',
                difficulty: 'beginner'
            },
            {
                id: 156,
                quizId: 4,
                type: 'multiple-choice',
                question: 'We _______ (not) park here. Look at the sign.',
                options: ['mustn\'t', 'don\'t have to', 'couldn\'t', 'might not'],
                correctAnswer: 'mustn\'t',
                explanation: 'Yasak.',
                difficulty: 'beginner'
            },
            {
                id: 157,
                quizId: 4,
                type: 'multiple-choice',
                question: '_______ I help you with your suitcase?',
                options: ['Shall', 'Will', 'Must', 'Should'],
                correctAnswer: 'Shall',
                explanation: 'Yardım teklifi.',
                difficulty: 'intermediate'
            },
            {
                id: 158,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'She _______ (be) very tired after such a long day.',
                options: ['must be', 'can be', 'should be', 'might be'],
                correctAnswer: 'must be',
                explanation: 'Güçlü çıkarım.',
                difficulty: 'intermediate'
            },
            {
                id: 159,
                quizId: 4,
                type: 'multiple-choice',
                question: 'You _______ (not) pay now. You can pay tomorrow.',
                options: ['mustn\'t', 'don\'t have to', 'shouldn\'t', 'couldn\'t'],
                correctAnswer: 'don\'t have to',
                explanation: 'Zorunluluk yok.',
                difficulty: 'beginner'
            },
            {
                id: 160,
                quizId: 4,
                type: 'multiple-choice',
                question: 'If you are sick, you _______ stay at home.',
                options: ['should', 'must', 'can', 'may'],
                correctAnswer: 'should',
                explanation: 'Tavsiye.',
                difficulty: 'beginner'
            }
        ]
    },

    // 5. Conditionals
    {
        topic: GrammarTopic.Conditionals,
        title: 'Conditionals',
        description: 'Zero, First ve Second Conditional yapılarını öğrenin',
        difficulty: 'intermediate',
        estimatedTime: 23,
        icon: '🔀',
        color: '#00BCD4',
        sections: [
            {
                type: 'theory',
                title: 'Genel Bakış',
                content: `Conditionals (Koşul Cümleleri), "Eğer ... olursa, ... olur" yapısını kurar. İki kısımdan oluşur: **If clause** (Koşul) ve **Main clause** (Sonuç).

### 1. Zero Conditional (Genel Doğrular)
**Mantık**: Bilimsel gerçekler veya her zaman doğru olan durumlar.
**Yapı**: If + Present Simple, **Present Simple**
- "**If** you heat ice, it **melts**." (Buzu ısıtırsan erir - her zaman).

### 2. First Conditional (Gerçek Olasılıklar)
**Mantık**: Gelecekte gerçekleşmesi muhtemel durumlar.
**Yapı**: If + Present Simple, **Will + V1**
- "**If** it rains, I **will stay** at home." (Yağmur yağarsa -ihtimal-, evde kalacağım).
> [!TIP]
> **Püf Noktası**: *If* tarafında asla *will* kullanmayın! "If I will go" yanlıştır.

### 3. Second Conditional (Hayaller / Gerçek Olmayan)
**Mantık**: Şu an için imkansız veya hayali durumlar.
**Yapı**: If + Past Simple, **Would + V1**
- "**If** I won the lottery, I **would travel** the world." (Piyangoyu kazansam -ama kazanmadım-, dünyayı gezerdim).
> [!NOTE]
> **Was/Were**: Bu yapıda "I/He/She/It" için bile genellikle **were** kullanılır. "If I **were** you..." (Senin yerinde olsaydım...).`
            },
            {
                type: 'examples',
                title: 'Koşul Cümlelerinin Karşılaştırması',
                examples: [
                    { sentence: 'If you heat ice, it melts.', highlight: 'heat...melts', explanation: 'Zero Conditional - bilimsel gerçek' },
                    { sentence: 'If it rains, I will take an umbrella.', highlight: 'rains...will take', explanation: 'First Conditional - gerçek gelecek olasılığı' },
                    { sentence: 'If I were rich, I would buy a house.', highlight: 'were...would buy', explanation: 'Second Conditional - gerçek olmayan şimdiki zaman (zengin değilim)' }
                ]
            },
            {
                type: 'tips',
                title: 'Sık Yapılan Hatalar',
                tips: [
                    '❌ If cümlesinde "will" kullanmayın: "If it will rain" → "If it rains"',
                    '❌ If cümlesinde "would" kullanmayın: "If I would have" → "If I had"',
                    '✅ Second Conditional\'da herkes için "were" kullanın: "If I were you..." ("If I was" değil)',
                    '✅ First Conditional = mümkün, Second Conditional = imkansız/hayali'
                ]
            }
        ],
        exercises: [
            {
                id: 161,
                quizId: 1,
                type: 'multiple-choice',
                question: 'If she studies hard, she _______ pass the exam.',
                options: ['will', 'would', 'can', 'could'],
                correctAnswer: 'will',
                explanation: 'Gerçek gelecek olasılıkları için ana cümlede "will" kullanın (First Conditional).',
                difficulty: 'beginner'
            },
            {
                id: 162,
                quizId: 1,
                type: 'multiple-choice',
                question: 'If I _______ you, I would apologize.',
                options: ['am', 'was', 'were', 'will be'],
                correctAnswer: 'were',
                explanation: 'Hayali durumlarla ilgili tavsiye vermek için "If I were you" (Second Conditional) kalıbını kullanın.',
                difficulty: 'beginner'
            },
            {
                id: 163,
                quizId: 1,
                type: 'multiple-choice',
                question: 'If I _______ a million dollars, I would buy a boat.',
                options: ['have', 'had', 'has', 'will have'],
                correctAnswer: 'had',
                explanation: 'Geçerli olmayan, hayali durumlar için "If + Past Simple, would + fiil" kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 164,
                quizId: 1,
                type: 'multiple-choice',
                question: 'If they _______ earlier, they wouldn\'t have missed the bus.',
                options: ['leave', 'left', 'had left', 'have left'],
                correctAnswer: 'had left',
                explanation: 'Geçmişteki pişmanlıklar için Third Conditional (If + Past Perfect, would have + V3) kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 165,
                quizId: 1,
                type: 'multiple-choice',
                question: 'If it _______, we stay at home.',
                options: ['rains', 'rain', 'will rain', 'rained'],
                correctAnswer: 'rains',
                explanation: 'Her zaman doğru olan genel durumlar için Zero Conditional (If + Present, Present) kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 166,
                quizId: 1,
                type: 'multiple-choice',
                question: 'If I _______ time, I will call you.',
                options: ['had', 'have', 'have had', 'will have'],
                correctAnswer: 'have',
                explanation: 'First Conditional: If cümlesinde Present Simple kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 167,
                quizId: 1,
                type: 'multiple-choice',
                question: 'You _______ weight if you exercise regularly.',
                options: ['lose', 'will lose', 'would lose', 'lost'],
                correctAnswer: 'will lose',
                explanation: 'First Conditional ana cümlesi "will" kullanır.',
                difficulty: 'beginner'
            },
            {
                id: 168,
                quizId: 1,
                type: 'multiple-choice',
                question: 'If I _______ you were coming, I would have baked a cake.',
                options: ['know', 'knew', 'had known', 'have known'],
                correctAnswer: 'had known',
                explanation: 'Third Conditional (If + Past Perfect).',
                difficulty: 'intermediate'
            },
            {
                id: 169,
                quizId: 1,
                type: 'multiple-choice',
                question: 'If you _______ water, it turns into ice.',
                options: ['freeze', 'freezes', 'will freeze', 'froze'],
                correctAnswer: 'freeze',
                explanation: 'Zero Conditional (Bilimsel gerçek).',
                difficulty: 'beginner'
            },
            {
                id: 170,
                quizId: 1,
                type: 'multiple-choice',
                question: 'If I _______ wings, I would fly.',
                options: ['have', 'had', 'has', 'would have'],
                correctAnswer: 'had',
                explanation: 'Second Conditional (Hayali durum).',
                difficulty: 'beginner'
            },

            // Quiz 2: Zero & First Conditionals
            {
                id: 171,
                quizId: 2,
                type: 'multiple-choice',
                question: 'If I _______ the lottery, I would buy a boat.',
                options: ['win', 'won', 'will win', 'win to'],
                correctAnswer: 'won',
                explanation: 'Second Conditional: Hayali durum (kazanmadım). Past Simple kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 172,
                quizId: 2,
                type: 'multiple-choice',
                question: 'If she _______ younger, she would travel more.',
                options: ['is', 'was', 'were', 'will be'],
                correctAnswer: 'were',
                explanation: 'Second Conditional: Üçüncü şahıslarda bile "were" kullanımı yaygındır/doğrudur.',
                difficulty: 'intermediate'
            },
            {
                id: 173,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'If you _______ (speak) English better, you would get the job.',
                options: ['speak', 'spoke', 'will speak', 'speaking'],
                correctAnswer: 'spoke',
                explanation: 'Hayali bir durumun şartını belirtiyoruz.',
                difficulty: 'intermediate'
            },
            {
                id: 174,
                quizId: 2,
                type: 'multiple-choice',
                question: 'I would go out if it _______ (not/rain).',
                options: ['didn\'t rain', 'doesn\'t rain', 'won\'t rain', 'not rain'],
                correctAnswer: 'didn\'t rain',
                explanation: 'Second Conditional olumsuz hali.',
                difficulty: 'intermediate'
            },
            {
                id: 175,
                quizId: 2,
                type: 'multiple-choice',
                question: 'Where _______ you live if you could live anywhere?',
                options: ['will', 'would', 'do', 'can'],
                correctAnswer: 'would',
                explanation: 'Second Conditional soru formu.',
                difficulty: 'intermediate'
            },
            {
                id: 176,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'If I _______ (be) you, I wouldn\'t buy that car.',
                options: ['am', 'was', 'were', 'be'],
                correctAnswer: 'were',
                explanation: 'Tavsiye kalıbı: If I were you...',
                difficulty: 'beginner'
            },
            {
                id: 177,
                quizId: 2,
                type: 'multiple-choice',
                question: 'If they _______ (work) less, they would be happier.',
                options: ['work', 'worked', 'will work', 'working'],
                correctAnswer: 'worked',
                explanation: 'Gerçek olmayan şimdiki durum.',
                difficulty: 'intermediate'
            },
            {
                id: 178,
                quizId: 2,
                type: 'multiple-choice',
                question: 'He _______ (be) healthier if he didn\'t smoke.',
                options: ['will be', 'would be', 'is', 'was'],
                correctAnswer: 'would be',
                explanation: 'Second Conditional sonuç kısmı.',
                difficulty: 'intermediate'
            },
            {
                id: 179,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'If it _______ (be) sunny, we would go to the beach.',
                options: ['is', 'was', 'were', 'will be'],
                correctAnswer: 'were',
                explanation: 'Second Conditional.',
                difficulty: 'intermediate'
            },
            {
                id: 180,
                quizId: 2,
                type: 'multiple-choice',
                question: 'What _______ you do if you lost your job?',
                options: ['will', 'would', 'do', 'can'],
                correctAnswer: 'would',
                explanation: 'Second Conditional sorusu.',
                difficulty: 'intermediate'
            },

            // Quiz 3: Mixed Zero & First Conditionals
            {
                id: 181,
                quizId: 3,
                type: 'multiple-choice',
                question: 'If you _______ (not/hurry), we will be late.',
                options: ['don\'t hurry', 'won\'t hurry', 'didn\'t hurry', 'not hurry'],
                correctAnswer: 'don\'t hurry',
                explanation: 'First Conditional: If tarafı Present Simple.',
                difficulty: 'beginner'
            },
            {
                id: 182,
                quizId: 3,
                type: 'multiple-choice',
                question: 'I _______ (call) you if I have any news.',
                options: ['call', 'will call', 'would call', 'am calling'],
                correctAnswer: 'will call',
                explanation: 'First Conditional: Sonuç tarafı "will".',
                difficulty: 'beginner'
            },
            {
                id: 183,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'If you heat water to 100 degrees, it _______ (boil).',
                options: ['boils', 'will boil', 'boiled', 'boil'],
                correctAnswer: 'boils',
                explanation: 'Zero Conditional: Bilimsel gerçek.',
                difficulty: 'beginner'
            },
            {
                id: 184,
                quizId: 3,
                type: 'multiple-choice',
                question: 'If I _______ (see) her, I will tell her you called.',
                options: ['see', 'will see', 'saw', 'have seen'],
                correctAnswer: 'see',
                explanation: 'First Conditional.',
                difficulty: 'beginner'
            },
            {
                id: 185,
                quizId: 3,
                type: 'multiple-choice',
                question: 'Unless it _______ (rain), we will have a picnic.',
                options: ['rains', 'doesn\'t rain', 'won\'t rain', 'will rain'],
                correctAnswer: 'rains',
                explanation: 'Unless = If not. "If it doesn\'t rain" yerine "Unless it rains" kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 186,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'If you _______ (touch) a fire, you get burned.',
                options: ['touch', 'will touch', 'touched', 'touching'],
                correctAnswer: 'touch',
                explanation: 'Zero Conditional.',
                difficulty: 'beginner'
            },
            {
                id: 187,
                quizId: 3,
                type: 'multiple-choice',
                question: 'She _______ (be) angry if we are late.',
                options: ['is', 'will be', 'would be', 'is going to be'],
                correctAnswer: 'will be',
                explanation: 'First Conditional.',
                difficulty: 'beginner'
            },
            {
                id: 188,
                quizId: 3,
                type: 'multiple-choice',
                question: 'If babies _______ (be) hungry, they cry.',
                options: ['are', 'will be', 'were', 'be'],
                correctAnswer: 'are',
                explanation: 'Zero Conditional: Genel gerçek.',
                difficulty: 'beginner'
            },
            {
                id: 189,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'I _______ (not/come) if it ruins.',
                options: ['don\'t come', 'won\'t come', 'wouldn\'t come', 'didn\'t come'],
                correctAnswer: 'won\'t come',
                explanation: 'First Conditional.',
                difficulty: 'beginner'
            },
            {
                id: 190,
                quizId: 3,
                type: 'multiple-choice',
                question: 'What _______ you do if you miss the train?',
                options: ['do', 'will', 'would', 'can'],
                correctAnswer: 'will',
                explanation: 'First Conditional sorusu.',
                difficulty: 'beginner'
            },

            // Quiz 4: Mixed Conditionals (0, 1, 2)
            {
                id: 191,
                quizId: 4,
                type: 'multiple-choice',
                question: 'If I _______ (have) a car, I wouldn\'t take the bus.',
                options: ['have', 'had', 'will have', 'have had'],
                correctAnswer: 'had',
                explanation: 'Second Conditional.',
                difficulty: 'intermediate'
            },
            {
                id: 192,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'If he _______ (arrive) on time, we can start.',
                options: ['arrives', 'will arrive', 'arrived', 'arrive'],
                correctAnswer: 'arrives',
                explanation: 'First Conditional.',
                difficulty: 'beginner'
            },
            {
                id: 193,
                quizId: 4,
                type: 'multiple-choice',
                question: 'If you _______ (not/study), you fail.',
                options: ['don\'t study', 'won\'t study', 'didn\'t study', 'haven\'t studied'],
                correctAnswer: 'don\'t study',
                explanation: 'Zero Conditional: Genel kural/gerçek.',
                difficulty: 'beginner'
            },
            {
                id: 194,
                quizId: 4,
                type: 'multiple-choice',
                question: 'I would help you if I _______ (can).',
                options: ['can', 'could', 'will be able to', 'was can'],
                correctAnswer: 'could',
                explanation: 'Second Conditional (can -> could).',
                difficulty: 'intermediate'
            },
            {
                id: 195,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'If I _______ (find) your book, I will give it back.',
                options: ['find', 'found', 'will find', 'finds'],
                correctAnswer: 'find',
                explanation: 'First Conditional.',
                difficulty: 'beginner'
            },
            {
                id: 196,
                quizId: 4,
                type: 'multiple-choice',
                question: 'The machine _______ (not/work) if you don\'t plug it in.',
                options: ['doesn\'t work', 'won\'t work', 'didn\'t work', 'not work'],
                correctAnswer: 'doesn\'t work',
                explanation: 'Zero Conditional.',
                difficulty: 'beginner'
            },
            {
                id: 197,
                quizId: 4,
                type: 'multiple-choice',
                question: 'If she _______ (know) the answer, she would tell us.',
                options: ['knows', 'knew', 'will know', 'know'],
                correctAnswer: 'knew',
                explanation: 'Second Conditional.',
                difficulty: 'intermediate'
            },
            {
                id: 198,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'If you _______ (be) late again, the teacher will be angry.',
                options: ['are', 'will be', 'were', 'be'],
                correctAnswer: 'are',
                explanation: 'First Conditional.',
                difficulty: 'beginner'
            },
            {
                id: 199,
                quizId: 4,
                type: 'multiple-choice',
                question: 'Ice _______ (melt) if you leave it in the sun.',
                options: ['melts', 'will melt', 'melted', 'is melting'],
                correctAnswer: 'melts',
                explanation: 'Zero Conditional.',
                difficulty: 'beginner'
            },
            {
                id: 200,
                quizId: 4,
                type: 'multiple-choice',
                question: 'If I _______ (live) in Italy, I would eat pizza every day.',
                options: ['live', 'lived', 'will live', 'was live'],
                correctAnswer: 'lived',
                explanation: 'Second Conditional.',
                difficulty: 'intermediate'
            }
        ]
    },

    // 6. Prepositions
    {
        topic: GrammarTopic.Prepositions,
        title: 'Prepositions',
        description: 'Zaman, yer ve hareket edatlarını öğrenin',
        difficulty: 'intermediate',
        estimatedTime: 20,
        icon: '📍',
        color: '#E91E63',
        sections: [
            {
                type: 'theory',
                title: 'Genel Bakış',
                content: `Prepositions (Edatlar), yer ve zaman belirtirken kullanılır. Unutmayın, bu kelimeleri "Üçgen Mantığı" ile kolayca hatırlayabilirsiniz.

### 1. Zaman (Time) İçin
- **IN (Geniş)**: Yıllar, aylar, mevsimler, günün bölümleri (*in 2024, in May, in the morning*).
- **ON (Belirli)**: Günler ve tarihler (*on Monday, on July 15th*).
- **AT (Tam Nokta)**: Saatler ve özel anlar (*at 5 PM, at night, at the weekend*).

### 2. Yer (Place) İçin
- **IN (İçerisinde)**: Şehirler, ülkeler ve kapalı alanlar (*in London, in a box*).
- **ON (Yüzeyinde/Üstünde)**: Masanın üstü, sokaklar, ulaşım araçları (*on the table, on the bus*).
- **AT (Noktasal Konum)**: Belirli bir adres veya nokta (*at the door, at the station*).

> [!TIP]
> **Ulaşım Farkı**: İçinde ayağa kalkabildiğiniz büyük araçlarda **ON** (*on the train*), küçük araçlarda ise **IN** (*in a car*) kullanılır.`
            },
            {
                type: 'examples',
                title: 'Örneklerle İnceleme',
                examples: [
                    { sentence: 'I was born in 1995.', highlight: 'in', explanation: 'Yıllar ile IN' },
                    { sentence: 'The meeting is on Friday.', highlight: 'on', explanation: 'Günler ile ON' },
                    { sentence: 'Let\'s meet at 6 PM.', highlight: 'at', explanation: 'Belirli saatler ile AT' },
                    { sentence: 'The book is on the table.', highlight: 'on', explanation: 'Yüzeyler için ON' }
                ]
            },
            {
                type: 'tips',
                title: 'Sık Yapılan Hatalar',
                tips: [
                    '❌ "in Monday" → "on Monday" (günler ON kullanır)',
                    '❌ "at 2020" → "in 2020" (yıllar IN kullanır)',
                    '❌ "in the table" → "on the table" (yüzeyler ON kullanır)',
                    '✅ İstisnalar: "at night", "at the weekend" (İngiliz), "on the weekend" (Amerikan)',
                    '✅ Kalıpları öğrenin: arrive at (binalar), arrive in (şehirler/ülkeler), depend on, listen to'
                ]
            }
        ],
        exercises: [
            {
                id: 201,
                quizId: 1,
                type: 'multiple-choice',
                question: 'I was born _______ 1995.',
                options: ['in', 'on', 'at', 'from'],
                correctAnswer: 'in',
                explanation: 'Yıllarla "in" kullanın.',
                difficulty: 'beginner'
            },
            {
                id: 202,
                quizId: 1,
                type: 'multiple-choice',
                question: 'The meeting is _______ Monday.',
                options: ['in', 'on', 'at', 'to'],
                correctAnswer: 'on',
                explanation: 'Haftanın günleriyle "on" kullanın.',
                difficulty: 'beginner'
            },
            {
                id: 203,
                quizId: 1,
                type: 'multiple-choice',
                question: 'Let\'s meet _______ 5 o\'clock.',
                options: ['in', 'on', 'at', 'to'],
                correctAnswer: 'at',
                explanation: 'Belirli saatlerle "at" kullanın.',
                difficulty: 'beginner'
            },
            {
                id: 204,
                quizId: 1,
                type: 'multiple-choice',
                question: 'The book is _______ the table.',
                options: ['in', 'on', 'at', 'into'],
                correctAnswer: 'on',
                explanation: 'Yüzeyler için "on" kullanın.',
                difficulty: 'beginner'
            },
            {
                id: 205,
                quizId: 1,
                type: 'multiple-choice',
                question: 'She lives _______ London.',
                options: ['in', 'on', 'at', 'to'],
                correctAnswer: 'in',
                explanation: 'Şehirler ve ülkelerle "in" kullanın.',
                difficulty: 'beginner'
            },
            {
                id: 206,
                quizId: 1,
                type: 'error-correction',
                question: 'I usually wake up in 7 AM.',
                correctAnswer: 'I usually wake up at 7 AM.',
                explanation: 'Saatlerle "at" kullanın.',
                difficulty: 'beginner'
            },
            {
                id: 207,
                quizId: 1,
                type: 'multiple-choice',
                question: 'We arrived _______ the airport at midnight.',
                options: ['in', 'on', 'at', 'to'],
                correctAnswer: 'at',
                explanation: 'Belirli noktalar/binalar için "arrive at" kullanın.',
                difficulty: 'intermediate'
            },
            {
                id: 208,
                quizId: 1,
                type: 'multiple-choice',
                question: 'I\'m going _______ bed now.',
                options: ['in', 'on', 'at', 'to'],
                correctAnswer: 'to',
                explanation: 'Yön/hareket bildirmek için "to" kullanın.',
                difficulty: 'intermediate'
            },
            {
                id: 209,
                quizId: 1,
                type: 'multiple-choice',
                question: 'My birthday is _______ July 15th.',
                options: ['in', 'on', 'at', 'from'],
                correctAnswer: 'on',
                explanation: 'Belirli tarihlerle "on" kullanın.',
                difficulty: 'beginner'
            },
            {
                id: 210,
                quizId: 1,
                type: 'fill-in-blank',
                question: 'I usually study _______ the evening.',
                options: ['in', 'on', 'at', 'to'],
                correctAnswer: 'in',
                explanation: 'Günün bölümleriyle "in" kullanın.',
                difficulty: 'intermediate'
            },

            // Quiz 2: Focus on Place & Movement
            {
                id: 211,
                quizId: 2,
                type: 'multiple-choice',
                question: 'The keys are _______ my pocket.',
                options: ['in', 'on', 'at', 'into'],
                correctAnswer: 'in',
                explanation: 'İçeride olma durumu için "in" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 212,
                quizId: 2,
                type: 'multiple-choice',
                question: 'We are sitting _______ the bus.',
                options: ['in', 'on', 'at', 'to'],
                correctAnswer: 'on',
                explanation: 'Toplu taşıma araçlarında (bus, train, plane) genellikle "on" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 213,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'He jumped _______ the water.',
                options: ['in', 'on', 'at', 'into'],
                correctAnswer: 'into',
                explanation: 'İçine doğru hareket bildirmek için "into" kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 214,
                quizId: 2,
                type: 'multiple-choice',
                question: 'I left my bag _______ the chair.',
                options: ['in', 'on', 'at', 'under'],
                correctAnswer: 'on',
                explanation: 'Sandalyenin üstüne bırakılan çanta için "on" uygundur.',
                difficulty: 'beginner'
            },
            {
                id: 215,
                quizId: 2,
                type: 'multiple-choice',
                question: 'They are waiting _______ the bus stop.',
                options: ['in', 'on', 'at', 'to'],
                correctAnswer: 'at',
                explanation: 'Noktasal konum bildirmek için "at" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 216,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'The cat is hiding _______ the bed.',
                options: ['in', 'on', 'under', 'at'],
                correctAnswer: 'under',
                explanation: 'Altında anlamı için "under" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 217,
                quizId: 2,
                type: 'multiple-choice',
                question: 'I live _______ the 3rd floor.',
                options: ['in', 'on', 'at', 'to'],
                correctAnswer: 'on',
                explanation: 'Katlar için "on" kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 218,
                quizId: 2,
                type: 'multiple-choice',
                question: 'She walked _______ the room.',
                options: ['into', 'on', 'at', 'to'],
                correctAnswer: 'into',
                explanation: 'Odanın içine giriş eylemi.',
                difficulty: 'beginner'
            },
            {
                id: 219,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'Put your laptop _______ the desk.',
                options: ['in', 'on', 'at', 'into'],
                correctAnswer: 'on',
                explanation: 'Masanın üstü (yüzey).',
                difficulty: 'beginner'
            },
            {
                id: 220,
                quizId: 2,
                type: 'multiple-choice',
                question: 'Wait for me _______ the entrance.',
                options: ['in', 'on', 'at', 'to'],
                correctAnswer: 'at',
                explanation: 'Giriş kapısı gibi belirli noktalar.',
                difficulty: 'beginner'
            },

            // Quiz 3: Focus on Time & Common Phrases
            {
                id: 221,
                quizId: 3,
                type: 'multiple-choice',
                question: 'I like reading _______ night.',
                options: ['in', 'on', 'at', 'to'],
                correctAnswer: 'at',
                explanation: '"At night" bir kalıptır.',
                difficulty: 'beginner'
            },
            {
                id: 222,
                quizId: 3,
                type: 'multiple-choice',
                question: 'We usually go on holiday _______ summer.',
                options: ['in', 'on', 'at', 'to'],
                correctAnswer: 'in',
                explanation: 'Mevsimlerle "in" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 223,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'The shop opens _______ 9 o\'clock.',
                options: ['in', 'on', 'at', 'to'],
                correctAnswer: 'at',
                explanation: 'Saatlerle "at".',
                difficulty: 'beginner'
            },
            {
                id: 224,
                quizId: 3,
                type: 'multiple-choice',
                question: 'I saw him _______ the weekend.',
                options: ['in', 'on', 'at', 'to'],
                correctAnswer: 'at',
                explanation: '"At the weekend" (UK) veya "On the weekend" (US) doğru kabul edilir. Burada "at" şıklar arasında.',
                difficulty: 'beginner'
            },
            {
                id: 225,
                quizId: 3,
                type: 'multiple-choice',
                question: 'What are you doing _______ Christmas Day?',
                options: ['in', 'on', 'at', 'to'],
                correctAnswer: 'on',
                explanation: 'İçinde "day" geçen özel günlerle "on" kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 226,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'I\'ll see you _______ a few days.',
                options: ['in', 'on', 'at', 'to'],
                correctAnswer: 'in',
                explanation: '"Birkaç gün içinde" anlamında "in" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 227,
                quizId: 3,
                type: 'multiple-choice',
                question: 'Listen _______ me!',
                options: ['at', 'on', 'to', 'for'],
                correctAnswer: 'to',
                explanation: '"Listen to" ayrılmaz bir bütündür.',
                difficulty: 'beginner'
            },
            {
                id: 228,
                quizId: 3,
                type: 'multiple-choice',
                question: 'It depends _______ the weather.',
                options: ['at', 'on', 'to', 'of'],
                correctAnswer: 'on',
                explanation: '"Depend on" (bağlı olmak) kalıbı.',
                difficulty: 'beginner'
            },
            {
                id: 229,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'I\'m good _______ playing chess.',
                options: ['in', 'on', 'at', 'with'],
                correctAnswer: 'at',
                explanation: '"Good at" (bir konuda iyi olmak) kalıbı.',
                difficulty: 'intermediate'
            },
            {
                id: 230,
                quizId: 3,
                type: 'multiple-choice',
                question: 'I\'m looking _______ my glasses. Have you seen them?',
                options: ['at', 'for', 'to', 'on'],
                correctAnswer: 'for',
                explanation: '"Look for" (aramak) anlamındadır.',
                difficulty: 'beginner'
            },

            // Quiz 4: Mixed Prepositions
            {
                id: 231,
                quizId: 4,
                type: 'multiple-choice',
                question: 'She is _______ the hospital visiting a friend.',
                options: ['in', 'on', 'at', 'to'],
                correctAnswer: 'at',
                explanation: 'Bina/kurum olarak hastanede bulunmak.',
                difficulty: 'beginner'
            },
            {
                id: 232,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'We arrived _______ Paris yesterday morning.',
                options: ['at', 'in', 'on', 'to'],
                correctAnswer: 'in',
                explanation: 'Şehir ve ülkelere varmak için "arrive in" kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 233,
                quizId: 4,
                type: 'multiple-choice',
                question: 'The restaurant is _______ the end of the street.',
                options: ['in', 'on', 'at', 'to'],
                correctAnswer: 'at',
                explanation: '"At the end of..." kalıbı.',
                difficulty: 'beginner'
            },
            {
                id: 234,
                quizId: 4,
                type: 'multiple-choice',
                question: 'I\'m interested _______ learning photography.',
                options: ['in', 'on', 'at', 'to'],
                correctAnswer: 'in',
                explanation: '"Interested in" kalıbı.',
                difficulty: 'beginner'
            },
            {
                id: 235,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'Let\'s go _______ a walk.',
                options: ['to', 'on', 'for', 'at'],
                correctAnswer: 'for',
                explanation: '"Go for a walk" (yürüyüşe çıkmak) kalıbı.',
                difficulty: 'beginner'
            },
            {
                id: 236,
                quizId: 4,
                type: 'multiple-choice',
                question: 'Are you afraid _______ spiders?',
                options: ['of', 'about', 'at', 'to'],
                correctAnswer: 'of',
                explanation: '"Afraid of" kalıbı.',
                difficulty: 'beginner'
            },
            {
                id: 237,
                quizId: 4,
                type: 'multiple-choice',
                question: 'He is married _______ a doctor.',
                options: ['with', 'to', 'at', 'of'],
                correctAnswer: 'to',
                explanation: '"Married to" (biriyle evli olmak) kalıbı.',
                difficulty: 'intermediate'
            },
            {
                id: 238,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'I\'m sorry _______ being late.',
                options: ['of', 'for', 'about', 'to'],
                correctAnswer: 'for',
                explanation: '"Sorry for (doing) something" kalıbı.',
                difficulty: 'beginner'
            },
            {
                id: 239,
                quizId: 4,
                type: 'multiple-choice',
                question: 'The picture is _______ the wall.',
                options: ['in', 'on', 'at', 'over'],
                correctAnswer: 'on',
                explanation: 'Duvar gibi dikey yüzeyler için "on" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 240,
                quizId: 4,
                type: 'multiple-choice',
                question: 'I normally go to work _______ foot.',
                options: ['by', 'on', 'with', 'at'],
                correctAnswer: 'on',
                explanation: '"On foot" (yürüyerek) kalıbı.',
                difficulty: 'beginner'
            }
        ]
    },

    // 7. Articles
    {
        topic: GrammarTopic.Articles,
        title: 'Articles',
        description: 'A, an, the ve zero article kullanımlarını öğrenin',
        difficulty: 'beginner',
        estimatedTime: 18,
        icon: '📰',
        color: '#3F51B5',
        sections: [
            {
                type: 'theory',
                title: 'Genel Bakış',
                content: `Articles (Tanımlayıcılar), bir isimden bahsederken onun "herhangi biri" mi yoksa "belirli biri" mi olduğunu gösterir.

### 1. A / AN (Belgisiz - Herhangi Biri)
- **Mantık**: Bir şeyden **ilk kez** bahsederken veya meslekleri söylerken kullanılır.
- **A**: Ünsüz sesle başlayanlar (*a university* - 'y' sesi).
- **AN**: Ünlü sesle başlayanlar (*an hour* - 'h' okunmaz).
- **Örnek**: "I saw **a** dog." (Herhangi bir köpek).

### 2. THE (Belirli - Bilinen Biri)
- **Mantık**: Dinleyicinin hangi şeyden bahsettiğinizi bildiği durumlar.
- **Tekrar**: "I saw a dog. **The** dog was black." (Az önce bahsettiğim köpek).
- **Eşsiz Şeyler**: *the sun, the moon, the internet*.
- **Müzik Aletleri**: "I play **the** piano."

### 3. No Article (Boşluk)
- **Genel Çoğullar**: "I like dogs." (Dünyadaki tüm köpekler).
- **Öğünler ve Sporlar**: "I have breakfast", "I play tennis".
- **Şehirler/Ülkeler**: "I live in Paris." (İstisna: *The USA, The UK* gibi çoğul yapılar).`
            },
            {
                type: 'examples',
                title: 'Örneklerle İnceleme',
                examples: [
                    { sentence: 'I saw a movie yesterday.', highlight: 'a', explanation: 'İlk kez bahsederken (belgisiz)' },
                    { sentence: 'The movie was great.', highlight: 'the', explanation: 'İkinci kez bahsederken (belirli hale geldi)' },
                    { sentence: 'The sun is hot.', highlight: 'the', explanation: 'Eşsiz/tek olan şeyler' },
                    { sentence: 'I like coffee.', highlight: '', explanation: 'Genel olarak sevilen şeyler (article yok)' }
                ]
            },
            {
                type: 'tips',
                title: 'Sık Yapılan Hatalar',
                tips: [
                    '❌ Tekil sayılabilen isimleri yalnız kullanmayın: "I have cat" → "I have a cat"',
                    '❌ Genel çoğullarla "the" kullanmayın: "I like the cats" → "I like cats" (Tüm kedileri seviyorsan)',
                    '❌ Mesleklerden önce "a/an" unutmayın: "I am doctor" → "I am a doctor"',
                    '✅ Telaffuza dikkat edin: "an hour" (h okunmaz), "a university" (y ile okunur)'
                ]
            }
        ],
        exercises: [
            {
                id: 241,
                quizId: 1,
                type: 'multiple-choice',
                question: 'I am _______ engineer.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'an',
                explanation: 'Ünlü sesiyle başlayan mesleklerden önce "an" kullanın.',
                difficulty: 'beginner'
            },
            {
                id: 242,
                quizId: 1,
                type: 'multiple-choice',
                question: 'I saw _______ cat. _______ cat was black.',
                options: ['a...A', 'a...The', 'the...The', 'the...A'],
                correctAnswer: 'a...The',
                explanation: 'İlk bahsedişte "a", ikinci bahsedişte "the" kullanın.',
                difficulty: 'intermediate'
            },
            {
                id: 243,
                quizId: 1,
                type: 'multiple-choice',
                question: '_______ sun rises in the east.',
                options: ['A', 'An', 'The', 'no article'],
                correctAnswer: 'The',
                explanation: 'Eşsiz varlıklar (güneş, dünya vb.) için "the" kullanın.',
                difficulty: 'beginner'
            },
            {
                id: 244,
                quizId: 1,
                type: 'multiple-choice',
                question: 'I like _______ music.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'no article',
                explanation: 'Genel olarak konuşurken sayılamayan isimlerle article kullanmayın.',
                difficulty: 'intermediate'
            },
            {
                id: 245,
                quizId: 1,
                type: 'error-correction',
                question: 'She is teacher at my school.',
                correctAnswer: 'She is a teacher at my school.',
                explanation: 'Mesleklerden önce "a/an" kullanın.',
                difficulty: 'beginner'
            },
            {
                id: 246,
                quizId: 1,
                type: 'multiple-choice',
                question: 'We live in _______ United States.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'the',
                explanation: '"States", "Kingdom" gibi kelimeler içeren ülke isimleriyle "the" kullanın.',
                difficulty: 'intermediate'
            },
            {
                id: 247,
                quizId: 1,
                type: 'multiple-choice',
                question: 'I have _______ hour to finish.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'an',
                explanation: 'Ünlü SESİ ile başlayan kelimelerle "an" kullanın (hour = our gibi okunur).',
                difficulty: 'intermediate'
            },
            {
                id: 248,
                quizId: 1,
                type: 'multiple-choice',
                question: 'She plays _______ piano beautifully.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'the',
                explanation: 'Müzik aletleriyle "the" kullanın.',
                difficulty: 'intermediate'
            },
            {
                id: 249,
                quizId: 1,
                type: 'multiple-choice',
                question: 'I eat _______ breakfast at 7 AM.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'no article',
                explanation: 'Öğün isimleriyle article kullanmayın.',
                difficulty: 'intermediate'
            },
            {
                id: 250,
                quizId: 1,
                type: 'multiple-choice',
                question: 'Paris is _______ capital of France.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'the',
                explanation: '"The capital of" (belirli bir şey) kalıbıyla "the" kullanın.',
                difficulty: 'beginner'
            },

            // Quiz 2: Focus on A vs An & Basic usage
            {
                id: 251,
                quizId: 2,
                type: 'multiple-choice',
                question: 'She wants to be _______ doctor.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'a',
                explanation: 'Mesleklerden önce eğer ünsüzle başlıyorsa "a" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 252,
                quizId: 2,
                type: 'multiple-choice',
                question: 'I have _______ umbrella.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'an',
                explanation: 'Ünlüyle başlayan isimlerden önce "an" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 253,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'It is _______ university.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'a',
                explanation: '"University" kelimesi "y" sesiyle başladığı için "a" alır.',
                difficulty: 'intermediate'
            },
            {
                id: 254,
                quizId: 2,
                type: 'multiple-choice',
                question: 'We saw _______ elephant at the zoo.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'an',
                explanation: ' elephant "e" sesiyle başlar.',
                difficulty: 'beginner'
            },
            {
                id: 255,
                quizId: 2,
                type: 'multiple-choice',
                question: 'I bought _______ new car.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'a',
                explanation: 'Sıfat tamlamalarında sıfatın baş harfine bakılır.',
                difficulty: 'beginner'
            },
            {
                id: 256,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'She is _______ honest person.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'an',
                explanation: '"Honest" kelimesinde "h" okunmaz, bu yüzden "an" alır.',
                difficulty: 'intermediate'
            },
            {
                id: 257,
                quizId: 2,
                type: 'multiple-choice',
                question: 'Do you have _______ euro?',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'a',
                explanation: '"Euro" kelimesi "y" sesiyle başlar (yuro).',
                difficulty: 'intermediate'
            },
            {
                id: 258,
                quizId: 2,
                type: 'multiple-choice',
                question: 'I saw _______ UFO yesterday.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'a',
                explanation: '"UFO" kelimesi "y" sesiyle başlar.',
                difficulty: 'intermediate'
            },
            {
                id: 259,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'He is _______ older than me.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'no article',
                explanation: 'Sıfatlar tek başına (isim olmadan) article almaz.',
                difficulty: 'beginner'
            },
            {
                id: 260,
                quizId: 2,
                type: 'multiple-choice',
                question: 'I need _______ water.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'no article',
                explanation: 'Sayılamayan isimlerle (su, süt vb.) "a/an" kullanılmaz.',
                difficulty: 'beginner'
            },

            // Quiz 3: Focus on The & No Article
            {
                id: 261,
                quizId: 3,
                type: 'multiple-choice',
                question: '_______ moon looks beautiful tonight.',
                options: ['A', 'An', 'The', 'no article'],
                correctAnswer: 'The',
                explanation: 'Eşsiz varlıklarda "the" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 262,
                quizId: 3,
                type: 'multiple-choice',
                question: 'I love _______ Italian food.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'no article',
                explanation: 'Genel kategorilerden bahsederken article kullanılmaz.',
                difficulty: 'beginner'
            },
            {
                id: 263,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'He plays _______ guitar.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'the',
                explanation: 'Müzik aletlerinden önce "the" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 264,
                quizId: 3,
                type: 'multiple-choice',
                question: 'I visited _______ London last year.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'no article',
                explanation: 'Şehir isimlerinden önce article kullanılmaz.',
                difficulty: 'beginner'
            },
            {
                id: 265,
                quizId: 3,
                type: 'multiple-choice',
                question: 'Is _______ internet working?',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'the',
                explanation: '"The internet" her zaman "the" ile kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 266,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'I had _______ dinner at 8 PM.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'no article',
                explanation: 'Öğünlerle article kullanılmaz.',
                difficulty: 'beginner'
            },
            {
                id: 267,
                quizId: 3,
                type: 'multiple-choice',
                question: 'She is _______ best student.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'the',
                explanation: 'Süperlatiflerle ("the best", "the biggest") "the" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 268,
                quizId: 3,
                type: 'multiple-choice',
                question: 'I like _______ dogs.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'no article',
                explanation: 'Genel çoğul isimlerle article kullanılmaz.',
                difficulty: 'beginner'
            },
            {
                id: 269,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'Close _______ door, please.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'the',
                explanation: 'Bilinen/belirli bir kapı kastedildiği için "the".',
                difficulty: 'beginner'
            },
            {
                id: 270,
                quizId: 3,
                type: 'multiple-choice',
                question: 'I play _______ football every weekend.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'no article',
                explanation: 'Spor dallarıyla article kullanılmaz.',
                difficulty: 'beginner'
            },

            // Quiz 4: Mixed Article Usage
            {
                id: 271,
                quizId: 4,
                type: 'multiple-choice',
                question: 'I have _______ idea.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'an',
                explanation: '"Idea" ünlüyle başlar.',
                difficulty: 'beginner'
            },
            {
                id: 272,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'Who is _______ man over there?',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'the',
                explanation: 'İşaret edilen belirli bir kişi.',
                difficulty: 'beginner'
            },
            {
                id: 273,
                quizId: 4,
                type: 'multiple-choice',
                question: 'He is _______ American citizen.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'an',
                explanation: 'American "a" sesiyle başlar.',
                difficulty: 'beginner'
            },
            {
                id: 274,
                quizId: 4,
                type: 'multiple-choice',
                question: 'I want to buy _______ expensive watch.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'an',
                explanation: 'Sıfat ünlüyle başlıyor.',
                difficulty: 'beginner'
            },
            {
                id: 275,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'Look at _______ sky!',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'the',
                explanation: 'Eşsiz varlık.',
                difficulty: 'beginner'
            },
            {
                id: 276,
                quizId: 4,
                type: 'multiple-choice',
                question: 'Do you speak _______ English?',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'no article',
                explanation: 'Dillerle article kullanılmaz.',
                difficulty: 'beginner'
            },
            {
                id: 277,
                quizId: 4,
                type: 'multiple-choice',
                question: 'I need _______ advice.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'no article',
                explanation: '"Advice" sayılamayan (uncountable) bir isimdir.',
                difficulty: 'intermediate'
            },
            {
                id: 278,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'I go to _______ school by bus.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'no article',
                explanation: 'Okulun temel amacı için (öğrenci olarak gitmek) article kullanılmaz.',
                difficulty: 'intermediate'
            },
            {
                id: 279,
                quizId: 4,
                type: 'multiple-choice',
                question: 'Have you ever been to _______ UK?',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'the',
                explanation: '"United Kingdom" kısaltmasıyla "the" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 280,
                quizId: 4,
                type: 'multiple-choice',
                question: 'I\'ll meet you in _______ hour.',
                options: ['a', 'an', 'the', 'no article'],
                correctAnswer: 'an',
                explanation: '"Hour" sessiz "h" ile başlar, "an" alır.',
                difficulty: 'beginner'
            }
        ]

    },

    // 8. Comparatives & Superlatives
    {
        topic: GrammarTopic.Comparatives,
        title: 'Comparatives & Superlatives',
        description: '-er/-est, more/most ve düzensiz halleri kullanarak karşılaştırmalar yapın',
        difficulty: 'beginner',
        estimatedTime: 18,
        icon: '📊',
        color: '#8BC34A',
        sections: [
            {
                type: 'theory',
                title: 'Genel Bakış',
                content: `Comparatives & Superlatives, nesneleri birbirleriyle karşılaştırmak için kullanılır.

### 1. Comparatives (Kıyaslama - 2 Şey)
- **Kısa Sıfatlar**: Sıfata **-er** eklenir + **than**. (*fast -> faster than*).
- **Uzun Sıfatlar**: Başına **more** gelir + **than**. (*more expensive than*).
- **İstisna**: *Big -> bigger* (Harf türemesi), *Happy -> happier* (y düşer).

### 2. Superlatives (Üstünlük - En Az 3 Şey)
- **Kısa Sıfatlar**: Başına **the** gelir + **-est**. (*the fastest*).
- **Uzun Sıfatlar**: Başına **the most** gelir. (*the most beautiful*).

### 3. Düzensiz Sıfatlar (Önemli!)
Bu sıfatlar kurala uymaz, ezberlenmesi gerekir:
- **Good** (İyi) -> **Better** -> **The Best**
- **Bad** (Kötü) -> **Worse** -> **The Worst**
- **Far** (Uzak) -> **Farther/Further** -> **The Farthest/Furthest**

> [!WARNING]
> **Hata Yapmayın**: Asla "more better" veya "the most tallest" demeyin. Ya ek kullanın ya da kelimeyi (more/most) kullanın!`
            },
            {
                type: 'examples',
                title: 'Örneklerle İnceleme',
                examples: [
                    { sentence: 'John is taller than Mike.', highlight: 'taller than', explanation: 'Kısa sıfat + -er + than' },
                    { sentence: 'This is the tallest building in the city.', highlight: 'the tallest', explanation: 'THE + kısa sıfat + -est' },
                    { sentence: 'This car is more expensive than that one.', highlight: 'more expensive than', explanation: 'Uzun sıfatlar "more...than" kullanır' },
                    { sentence: 'She is the best student in the class.', highlight: 'the best', explanation: 'Düzensiz süperlatif şekli' }
                ]
            },
            {
                type: 'tips',
                title: 'Sık Yapılan Hatalar',
                tips: [
                    '❌ "more tall" → "taller" (kısa sıfatlar -er kullanır, more değil)',
                    '❌ "the beautifulest" → "the most beautiful" (uzun sıfatlar most kullanır)',
                    '❌ "more better" → "better" (more ile düzensiz halleri birleştirmeyin)',
                    '✅ Karşılaştırmalardan sonra hep "than" kullanın: taller than, more beautiful than',
                    '✅ Süperlatiflerden önce hep "the" kullanın: the best, the most expensive'
                ]
            }
        ],
        exercises: [
            {
                id: 281,
                quizId: 1,
                type: 'multiple-choice',
                question: 'My house is _______ than yours.',
                options: ['big', 'bigger', 'biggest', 'more big'],
                correctAnswer: 'bigger',
                explanation: 'Kısa sıfatlar comparative için -er alır. "Big" ünsüz türemesine uğrar.',
                difficulty: 'beginner'
            },
            {
                id: 282,
                quizId: 1,
                type: 'multiple-choice',
                question: 'This is _______ book I\'ve ever read.',
                options: ['interesting', 'more interesting', 'the most interesting', 'most interesting'],
                correctAnswer: 'the most interesting',
                explanation: 'Uzun sıfatlar superlative için "the most" kullanır. "The"yı unutmayın.',
                difficulty: 'intermediate'
            },
            {
                id: 283,
                quizId: 1,
                type: 'multiple-choice',
                question: 'She is _______ student in the class.',
                options: ['good', 'better', 'the best', 'the better'],
                correctAnswer: 'the best',
                explanation: 'Düzensiz süperlatif: good → better → the best.',
                difficulty: 'beginner'
            },
            {
                id: 284,
                quizId: 1,
                type: 'error-correction',
                question: 'This exam was more easy than the last one.',
                correctAnswer: 'This exam was easier than the last one.',
                explanation: 'Kısa sıfatlar (veya y ile bitenler) -er kullanır (easier), "more easy" değil.',
                difficulty: 'intermediate'
            },
            {
                id: 285,
                quizId: 1,
                type: 'multiple-choice',
                question: 'Today is _______ than yesterday.',
                options: ['hot', 'hotter', 'more hot', 'the hottest'],
                correctAnswer: 'hotter',
                explanation: 'Kısa sıfat "hot" son harfini çiftler ve -er alır.',
                difficulty: 'beginner'
            },
            {
                id: 286,
                quizId: 1,
                type: 'multiple-choice',
                question: 'Mount Everest is _______ mountain in the world.',
                options: ['high', 'higher', 'highest', 'the highest'],
                correctAnswer: 'the highest',
                explanation: 'Süperlatifler "the" gerektirir. Kısa sıfatlar -est alır.',
                difficulty: 'beginner'
            },
            {
                id: 287,
                quizId: 1,
                type: 'multiple-choice',
                question: 'His condition is getting _______.',
                options: ['bad', 'worse', 'worst', 'more bad'],
                correctAnswer: 'worse',
                explanation: 'Düzensiz karşılaştırma: bad → worse → worst. "More bad" kullanmayın.',
                difficulty: 'intermediate'
            },
            {
                id: 288,
                quizId: 1,
                type: 'multiple-choice',
                question: 'She is _______ her sister.',
                options: ['tall than', 'taller than', 'taller as', 'more tall than'],
                correctAnswer: 'taller than',
                explanation: 'Karşılaştırmalar "than" kullanır ve kısa sıfatlar -er alır.',
                difficulty: 'beginner'
            },
            {
                id: 289,
                quizId: 1,
                type: 'fill-in-blank',
                question: 'This question is _______ (difficult) than that one.',
                options: ['difficult', 'difficulter', 'more difficult', 'most difficult'],
                correctAnswer: 'more difficult',
                explanation: 'Uzun sıfatlar (3+ heceli) karşılaştırma için "more" kullanır.',
                difficulty: 'intermediate'
            },
            {
                id: 290,
                quizId: 1,
                type: 'multiple-choice',
                question: 'Of all the students, Maria studies _______.',
                options: ['hard', 'harder', 'hardest', 'the hardest'],
                correctAnswer: 'the hardest',
                explanation: 'Süperlatifler "the" gerektirir ve kısa kelimeler için -est kullanır.',
                difficulty: 'intermediate'
            },

            // Quiz 2: Focus on Comparatives
            {
                id: 291,
                quizId: 2,
                type: 'multiple-choice',
                question: 'A plane is _______ a car.',
                options: ['fast than', 'faster than', 'more fast than', 'the fastest'],
                correctAnswer: 'faster than',
                explanation: 'İki şeyi karşılaştırırken -er + than.',
                difficulty: 'beginner'
            },
            {
                id: 292,
                quizId: 2,
                type: 'multiple-choice',
                question: 'Gold is _______ silver.',
                options: ['expensive than', 'more expensive than', 'the most expensive', 'expensiver than'],
                correctAnswer: 'more expensive than',
                explanation: 'Uzun sıfatlarda "more...than".',
                difficulty: 'beginner'
            },
            {
                id: 293,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'The weather today is _______ (bad) than yesterday.',
                options: ['badder', 'worse', 'worst', 'more bad'],
                correctAnswer: 'worse',
                explanation: 'Bad -> worse.',
                difficulty: 'beginner'
            },
            {
                id: 294,
                quizId: 2,
                type: 'multiple-choice',
                question: 'Apples are _______ for you than candy.',
                options: ['healthy', 'healthier', 'more healthy', 'healthiest'],
                correctAnswer: 'healthier',
                explanation: 'Y ile bitenlerde y düşer, -ier gelir.',
                difficulty: 'beginner'
            },
            {
                id: 295,
                quizId: 2,
                type: 'multiple-choice',
                question: 'This exercise is _______ than the first one.',
                options: ['easy', 'easier', 'more easy', 'the easiest'],
                correctAnswer: 'easier',
                explanation: 'Easy -> easier.',
                difficulty: 'beginner'
            },
            {
                id: 296,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'My brother is _______ (old) than me.',
                options: ['old', 'older', 'oldest', 'more old'],
                correctAnswer: 'older',
                explanation: 'Kısa sıfat + -er.',
                difficulty: 'beginner'
            },
            {
                id: 297,
                quizId: 2,
                type: 'multiple-choice',
                question: 'The city is _______ than the country.',
                options: ['noisy', 'noisier', 'more noisy', 'noisiest'],
                correctAnswer: 'noisier',
                explanation: 'Noisy -> noisier.',
                difficulty: 'beginner'
            },
            {
                id: 298,
                quizId: 2,
                type: 'multiple-choice',
                question: 'This movie is _______ than the one we saw last week.',
                options: ['boring', 'more boring', 'boringer', 'the most boring'],
                correctAnswer: 'more boring',
                explanation: '"Boring" uzun sıfat kabul edilir.',
                difficulty: 'intermediate'
            },
            {
                id: 299,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'I feel _______ (good) today than yesterday.',
                options: ['gooder', 'better', 'best', 'more good'],
                correctAnswer: 'better',
                explanation: 'Good -> better.',
                difficulty: 'beginner'
            },
            {
                id: 300,
                quizId: 2,
                type: 'multiple-choice',
                question: 'A library is _______ a disco.',
                options: ['quiet than', 'quieter than', 'more quiet than', 'the quietest'],
                correctAnswer: 'quieter than',
                explanation: 'Quiet -> quieter.',
                difficulty: 'beginner'
            },

            // Quiz 3: Focus on Superlatives
            {
                id: 301,
                quizId: 3,
                type: 'multiple-choice',
                question: 'Who is _______ person in your family?',
                options: ['tall', 'taller', 'the tallest', 'tallest'],
                correctAnswer: 'the tallest',
                explanation: 'Süperlatiflerde "the"yı unutmayın.',
                difficulty: 'beginner'
            },
            {
                id: 302,
                quizId: 3,
                type: 'multiple-choice',
                question: 'It was _______ day of my life.',
                options: ['happiest', 'the happiest', 'more happy', 'happyest'],
                correctAnswer: 'the happiest',
                explanation: 'Happy -> the happiest.',
                difficulty: 'beginner'
            },
            {
                id: 303,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'What is _______ (expensive) thing you own?',
                options: ['expense', 'more expensive', 'the most expensive', 'most expensive'],
                correctAnswer: 'the most expensive',
                explanation: 'Uzun sıfat süperlatif.',
                difficulty: 'beginner'
            },
            {
                id: 304,
                quizId: 3,
                type: 'multiple-choice',
                question: 'He is _______ player on the team.',
                options: ['good', 'better', 'the best', 'best'],
                correctAnswer: 'the best',
                explanation: 'Düzensiz süperlatif.',
                difficulty: 'beginner'
            },
            {
                id: 305,
                quizId: 3,
                type: 'multiple-choice',
                question: 'This is _______ pizza I\'ve ever eaten!',
                options: ['delicious', 'more delicious', 'the most delicious', 'most delicious'],
                correctAnswer: 'the most delicious',
                explanation: 'Uzun sıfat süperlatif.',
                difficulty: 'beginner'
            },
            {
                id: 306,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'Russia is _______ (large) country in the world.',
                options: ['large', 'larger', 'the largest', 'largest'],
                correctAnswer: 'the largest',
                explanation: 'Large -> the largest.',
                difficulty: 'beginner'
            },
            {
                id: 307,
                quizId: 3,
                type: 'multiple-choice',
                question: 'That was _______ movie I\'ve ever seen.',
                options: ['bad', 'worse', 'the worst', 'worst'],
                correctAnswer: 'the worst',
                explanation: 'Bad -> the worst.',
                difficulty: 'beginner'
            },
            {
                id: 308,
                quizId: 3,
                type: 'multiple-choice',
                question: 'She is _______ girl in the school.',
                options: ['popular', 'more popular', 'the most popular', 'most popular'],
                correctAnswer: 'the most popular',
                explanation: 'Popular -> the most popular.',
                difficulty: 'beginner'
            },
            {
                id: 309,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'Whose bag is _______ (heavy)?',
                options: ['heavy', 'heavier', 'the heaviest', 'heaviest'],
                correctAnswer: 'the heaviest',
                explanation: 'Heavy -> the heaviest.',
                difficulty: 'beginner'
            },
            {
                id: 310,
                quizId: 3,
                type: 'multiple-choice',
                question: 'This is _______ part of the exam.',
                options: ['difficult', 'more difficult', 'the most difficult', 'most difficult'],
                correctAnswer: 'the most difficult',
                explanation: 'Difficult -> the most difficult.',
                difficulty: 'beginner'
            },

            // Quiz 4: Mixed Comparatives & Superlatives
            {
                id: 311,
                quizId: 4,
                type: 'multiple-choice',
                question: 'I think science is _______ than history.',
                options: ['difficult', 'more difficult', 'the most difficult', 'difficulter'],
                correctAnswer: 'more difficult',
                explanation: 'Comparative.',
                difficulty: 'beginner'
            },
            {
                id: 312,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'Summer is _______ (hot) than spring.',
                options: ['hot', 'hotter', 'hottest', 'more hot'],
                correctAnswer: 'hotter',
                explanation: 'Comparative.',
                difficulty: 'beginner'
            },
            {
                id: 313,
                quizId: 4,
                type: 'multiple-choice',
                question: 'What is _______ sport in your country?',
                options: ['popular', 'more popular', 'the most popular', 'most popular'],
                correctAnswer: 'the most popular',
                explanation: 'Superlative.',
                difficulty: 'beginner'
            },
            {
                id: 314,
                quizId: 4,
                type: 'multiple-choice',
                question: 'I am _______ than my sister.',
                options: ['younger', 'youngest', 'more young', 'the younger'],
                correctAnswer: 'younger',
                explanation: 'Comparative.',
                difficulty: 'beginner'
            },
            {
                id: 315,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'This is _______ (bad) mistake I\'ve made.',
                options: ['bad', 'worse', 'the worst', 'worst'],
                correctAnswer: 'the worst',
                explanation: 'Superlative.',
                difficulty: 'beginner'
            },
            {
                id: 316,
                quizId: 4,
                type: 'multiple-choice',
                question: 'Is your new job _______ than your old one?',
                options: ['good', 'better', 'best', 'the best'],
                correctAnswer: 'better',
                explanation: 'Comparative.',
                difficulty: 'beginner'
            },
            {
                id: 317,
                quizId: 4,
                type: 'multiple-choice',
                question: 'She bought _______ dress in the shop.',
                options: ['cheap', 'cheaper', 'the cheapest', 'cheapest'],
                correctAnswer: 'the cheapest',
                explanation: 'Superlative.',
                difficulty: 'beginner'
            },
            {
                id: 318,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'My car is _______ (fast) than yours.',
                options: ['fast', 'faster', 'the fastest', 'fastest'],
                correctAnswer: 'faster',
                explanation: 'Comparative.',
                difficulty: 'beginner'
            },
            {
                id: 319,
                quizId: 4,
                type: 'multiple-choice',
                question: 'English is _______ for me than math.',
                options: ['easy', 'easier', 'easiest', 'more easy'],
                correctAnswer: 'easier',
                explanation: 'Comparative.',
                difficulty: 'beginner'
            },
            {
                id: 320,
                quizId: 4,
                type: 'multiple-choice',
                question: 'This is _______ cake in the world!',
                options: ['good', 'better', 'the best', 'best'],
                correctAnswer: 'the best',
                explanation: 'Superlative.',
                difficulty: 'beginner'
            }
        ]
    },
    ...additionalGrammarLessons
];

// Helper function to get a lesson by topic
export const getLessonByTopic = (topic: GrammarTopic): GrammarLesson | undefined => {
    return grammarLessons.find(lesson => lesson.topic === topic);
};

// Helper function to get all topics
export const getAllTopics = (): GrammarTopic[] => {
    return grammarLessons.map(lesson => lesson.topic);
};

// Export count for validation
export const totalLessons = grammarLessons.length; // Should be 12
export const totalExercises = grammarLessons.reduce((sum, lesson) => sum + lesson.exercises.length, 0); // Should be 480

