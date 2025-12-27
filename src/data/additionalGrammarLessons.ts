import { GrammarLesson, GrammarTopic } from '../types/grammarLesson';

// Additional Grammar Lessons: Passive Voice, Reported Speech, Question Formation, Phrasal Verbs
export const additionalGrammarLessons: GrammarLesson[] = [
    // 9. Passive Voice
    {
        topic: GrammarTopic.PassiveVoice,
        title: 'Passive Voice',
        description: 'Edilgen yapıyı ne zaman ve nasıl kullanacağınızı öğrenin',
        difficulty: 'intermediate',
        estimatedTime: 22,
        icon: '🔄',
        color: '#795548',
        sections: [
            {
                type: 'theory',
                title: 'Genel Bakış',
                content: `Passive Voice (Edilgen Çatı), biz eylemi yapan kişiden (özneden) ziyade, eylemin kendisi veya eylemden etkilenen nesneyle ilgilendiğimizde kullanılır.

**Yapı**: **BE** (am/is/are/was/were) + **V3** (Fiilin 3. hali)

### 1. Neden Passive Kullanırız?
1. **Yapan Kişi Bilinmiyorsa**: "My bike **was stolen**." (Kim çaldı? Bilmiyoruz).
2. **Yapan Kişi Önemsizse**: "This house **was built** in 1950." (Kimin yaptığı değil, evin yapılması önemli).
3. **Resmi bir Dil Kullanmak İçin**: "The rules **must be followed**."

### 2. Zamanlara Göre Değişim
- **Present Simple**: is/are + V3 | "Letters **are sent**."
- **Past Simple**: was/were + V3 | "The letter **was sent**."
- **Future (Will)**: will be + V3 | "The letter **will be sent**."

> [!TIP]
> **Yapanı Belirtmek**: Eğer eylemi kimin yaptığını söylemek isterseniz **by** kelimesini kullanın. "The book was written **by** Hemingway."`
            },
            {
                type: 'examples',
                title: 'Etken (Active) vs Edilgen (Passive)',
                examples: [
                    { sentence: 'The letter was sent yesterday.', highlight: 'was sent', explanation: 'Passive - mektuba odaklanılmış, gönderene değil' },
                    { sentence: 'English is spoken in many countries.', highlight: 'is spoken', explanation: 'Passive - konuşanlar bilinmiyor/genel' },
                    { sentence: 'The pyramids were built thousands of years ago.', highlight: 'were built', explanation: 'Passive - inşa edenler bilinmiyor/önemsiz' }
                ]
            },
            {
                type: 'tips',
                title: 'Sık Yapılan Hatalar',
                tips: [
                    '❌ "be" fiilini unutmayın: "The house built" → "The house was built"',
                    '❌ Active daha netse Passive kullanmayın: "Mistakes were made by me" → "I made mistakes"',
                    '✅ Sadece yapan kişi önemliyse "by" kullanın: "was written by Shakespeare"',
                    '✅ Passive haberlerde, bilimsel ve resmi yazılarda yaygındır'
                ]
            }
        ],
        exercises: [
            {
                id: 321,
                quizId: 1,
                type: 'multiple-choice',
                question: 'English _______ in many countries.',
                options: ['speak', 'speaks', 'is spoken', 'was spoken'],
                correctAnswer: 'is spoken',
                explanation: 'Genel gerçekler için Present Simple Passive: is/are + V3.',
                difficulty: 'beginner'
            },
            {
                id: 322,
                quizId: 1,
                type: 'multiple-choice',
                question: 'The package _______ yesterday.',
                options: ['deliver', 'delivered', 'was delivered', 'is delivered'],
                correctAnswer: 'was delivered',
                explanation: 'Geçmiş eylemler için Past Simple Passive: was/were + V3. "Yesterday" geçmiş zamanı belirtir.',
                difficulty: 'beginner'
            },
            {
                id: 323,
                quizId: 1,
                type: 'error-correction',
                question: 'The homework must completed by Friday.',
                correctAnswer: 'The homework must be completed by Friday.',
                explanation: 'Modallardan sonra "be" kullanın: must be + V3.',
                difficulty: 'intermediate'
            },
            {
                id: 324,
                quizId: 1,
                type: 'multiple-choice',
                question: 'A new school _______ in our neighborhood next year.',
                options: ['will build', 'will be built', 'will built', 'is built'],
                correctAnswer: 'will be built',
                explanation: 'Gelecek zaman Passive: will be + V3.',
                difficulty: 'intermediate'
            },
            {
                id: 325,
                quizId: 1,
                type: 'multiple-choice',
                question: 'The work _______ already _______.',
                options: ['has...done', 'have...done', 'has...been done', 'is...done'],
                correctAnswer: 'has...been done',
                explanation: 'Present Perfect Passive: has/have been + V3.',
                difficulty: 'intermediate'
            },
            {
                id: 326,
                quizId: 1,
                type: 'multiple-choice',
                question: 'This book _______ by millions of people.',
                options: ['read', 'reads', 'is read', 'was read'],
                correctAnswer: 'is read',
                explanation: 'Genel gerçekler için Present Simple Passive.',
                difficulty: 'beginner'
            },
            {
                id: 327,
                quizId: 1,
                type: 'fill-in-blank',
                question: 'The Mona Lisa _______ (paint) by Leonardo da Vinci.',
                options: ['painted', 'was painted', 'is painted', 'has painted'],
                correctAnswer: 'was painted',
                explanation: 'Geçmişte tamamlanmış eylem için Past Simple Passive.',
                difficulty: 'beginner'
            },
            {
                id: 328,
                quizId: 1,
                type: 'multiple-choice',
                question: 'I _______ to the party last week.',
                options: ['invited', 'was invited', 'am invited', 'invite'],
                correctAnswer: 'was invited',
                explanation: 'Past Simple Passive. Özne (I) eylemi alır (davet edildi).',
                difficulty: 'beginner'
            },
            {
                id: 329,
                quizId: 1,
                type: 'multiple-choice',
                question: 'All the cookies _______.',
                options: ['ate', 'have eaten', 'have been eaten', 'has been eaten'],
                correctAnswer: 'have been eaten',
                explanation: 'Çoğul özne (cookies) ile Present Perfect Passive.',
                difficulty: 'intermediate'
            },
            {
                id: 330,
                quizId: 1,
                type: 'error-correction',
                question: 'The car is wash every week.',
                correctAnswer: 'The car is washed every week.',
                explanation: 'Passive yapısı past participle (washed) gerektirir, yalın hal değil.',
                difficulty: 'intermediate'
            },

            // Quiz 2: Present & Past Passive
            {
                id: 331,
                quizId: 2,
                type: 'multiple-choice',
                question: 'Coffee _______ in Brazil.',
                options: ['is grown', 'grows', 'are grown', 'was grown'],
                correctAnswer: 'is grown',
                explanation: 'Present Simple Passive.',
                difficulty: 'beginner'
            },
            {
                id: 332,
                quizId: 2,
                type: 'multiple-choice',
                question: 'America _______ by Columbus in 1492.',
                options: ['is discovered', 'was discovered', 'discovered', 'has been discovered'],
                correctAnswer: 'was discovered',
                explanation: 'Past Simple Passive.',
                difficulty: 'beginner'
            },
            {
                id: 333,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'Many trees _______ (cut) down every year.',
                options: ['is cut', 'are cut', 'was cut', 'were cut'],
                correctAnswer: 'are cut',
                explanation: 'Present Simple Passive (Çoğul).',
                difficulty: 'beginner'
            },
            {
                id: 334,
                quizId: 2,
                type: 'multiple-choice',
                question: 'The bridge _______ in 1920.',
                options: ['is built', 'was built', 'were built', 'built'],
                correctAnswer: 'was built',
                explanation: 'Past Simple Passive (Tekil).',
                difficulty: 'beginner'
            },
            {
                id: 335,
                quizId: 2,
                type: 'multiple-choice',
                question: 'These cars _______ in Japan.',
                options: ['are made', 'is made', 'was made', 'make'],
                correctAnswer: 'are made',
                explanation: 'Present Simple Passive (Çoğul).',
                difficulty: 'beginner'
            },
            {
                id: 336,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'The window _______ (break) by a ball yesterday.',
                options: ['is broken', 'was broken', 'broken', 'was break'],
                correctAnswer: 'was broken',
                explanation: 'Past Simple Passive.',
                difficulty: 'beginner'
            },
            {
                id: 337,
                quizId: 2,
                type: 'multiple-choice',
                question: 'Dinner _______ at 7 PM every day.',
                options: ['is served', 'are served', 'was served', 'serves'],
                correctAnswer: 'is served',
                explanation: 'Present Simple Passive.',
                difficulty: 'beginner'
            },
            {
                id: 338,
                quizId: 2,
                type: 'multiple-choice',
                question: 'The thief _______ by the police last night.',
                options: ['is caught', 'was caught', 'caught', 'were caught'],
                correctAnswer: 'was caught',
                explanation: 'Past Simple Passive.',
                difficulty: 'beginner'
            },
            {
                id: 339,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'Millions of emails _______ (send) every minute.',
                options: ['is sent', 'are sent', 'was sent', 'send'],
                correctAnswer: 'are sent',
                explanation: 'Present Simple Passive.',
                difficulty: 'beginner'
            },
            {
                id: 340,
                quizId: 2,
                type: 'multiple-choice',
                question: 'The telephone _______ by Alexander Graham Bell.',
                options: ['is invented', 'was invented', 'invented', 'has been invented'],
                correctAnswer: 'was invented',
                explanation: 'Past Simple Passive.',
                difficulty: 'beginner'
            },

            // Quiz 3: Perfect & Future Passive
            {
                id: 341,
                quizId: 3,
                type: 'multiple-choice',
                question: 'The house _______ redecorated.',
                options: ['has been', 'have been', 'is', 'was'],
                correctAnswer: 'has been',
                explanation: 'Present Perfect Passive.',
                difficulty: 'intermediate'
            },
            {
                id: 342,
                quizId: 3,
                type: 'multiple-choice',
                question: 'The city _______ by a meteor.',
                options: ['will destroy', 'will be destroyed', 'is destroyed', 'destroys'],
                correctAnswer: 'will be destroyed',
                explanation: 'Future Passive.',
                difficulty: 'intermediate'
            },
            {
                id: 343,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'My car _______ (repair) by the mechanic now.',
                options: ['is repaired', 'is being repaired', 'was repaired', 'has been repaired'],
                correctAnswer: 'is being repaired',
                explanation: 'Present Continuous Passive.',
                difficulty: 'intermediate'
            },
            {
                id: 344,
                quizId: 3,
                type: 'multiple-choice',
                question: 'The report _______ by the end of the day.',
                options: ['will finish', 'will be finished', 'is finished', 'was finished'],
                correctAnswer: 'will be finished',
                explanation: 'Future Passive.',
                difficulty: 'intermediate'
            },
            {
                id: 345,
                quizId: 3,
                type: 'multiple-choice',
                question: 'The problem _______ yet.',
                options: ["hasn't solved", "hasn't been solved", "isn't solved", "wasn't solved"],
                correctAnswer: "hasn't been solved",
                explanation: 'Present Perfect Passive (yet ile).',
                difficulty: 'intermediate'
            },
            {
                id: 346,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'The results _______ (publish) next week.',
                options: ['publish', 'will be published', 'is published', 'are published'],
                correctAnswer: 'will be published',
                explanation: 'Future Passive.',
                difficulty: 'intermediate'
            },
            {
                id: 347,
                quizId: 3,
                type: 'multiple-choice',
                question: 'When I arrived, the room _______ (clean).',
                options: ['is being cleaned', 'was being cleaned', 'has been cleaned', 'was cleaned'],
                correctAnswer: 'was being cleaned',
                explanation: 'Past Continuous Passive.',
                difficulty: 'intermediate'
            },
            {
                id: 348,
                quizId: 3,
                type: 'multiple-choice',
                question: 'The decision _______ (make) by the board.',
                options: ['has made', 'has been made', 'is made', 'was made'],
                correctAnswer: 'has been made',
                explanation: 'Present Perfect Passive.',
                difficulty: 'intermediate'
            },
            {
                id: 349,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'They told me that the meeting _______ (cancel).',
                options: ['cancelled', 'had been cancelled', 'was cancelled', 'has been cancelled'],
                correctAnswer: 'had been cancelled',
                explanation: 'Past Perfect Passive.',
                difficulty: 'intermediate'
            },
            {
                id: 350,
                quizId: 3,
                type: 'multiple-choice',
                question: 'New laws _______ next year.',
                options: ['will pass', 'will be passed', 'is passed', 'are passed'],
                correctAnswer: 'will be passed',
                explanation: 'Future Passive.',
                difficulty: 'intermediate'
            },

            // Quiz 4: Mixed Passive & Modal Passive
            {
                id: 351,
                quizId: 4,
                type: 'multiple-choice',
                question: 'The application _______ (must/send) before Friday.',
                options: ['must send', 'must be sent', 'must being sent', 'must to be sent'],
                correctAnswer: 'must be sent',
                explanation: 'Modal Passive: modal + be + V3.',
                difficulty: 'intermediate'
            },
            {
                id: 352,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'Smoking _______ (not/allow) in this building.',
                options: ["isn't allowed", "doesn't allow", "wasn't allowed", 'not allowed'],
                correctAnswer: "isn't allowed",
                explanation: 'Present Simple Passive.',
                difficulty: 'beginner'
            },
            {
                id: 353,
                quizId: 4,
                type: 'multiple-choice',
                question: 'The pyramids _______ (build) by ancient Egyptians.',
                options: ['build', 'built', 'were built', 'are built'],
                correctAnswer: 'were built',
                explanation: 'Past Simple Passive.',
                difficulty: 'beginner'
            },
            {
                id: 354,
                quizId: 4,
                type: 'multiple-choice',
                question: 'Information _______ (can/find) on the internet.',
                options: ['can find', 'can be found', 'can found', 'could find'],
                correctAnswer: 'can be found',
                explanation: 'Modal Passive.',
                difficulty: 'beginner'
            },
            {
                id: 355,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'The room _______ (clean) every day.',
                options: ['is cleaned', 'are cleaned', 'was cleaned', 'is cleaning'],
                correctAnswer: 'is cleaned',
                explanation: 'Present Simple Passive.',
                difficulty: 'beginner'
            },
            {
                id: 356,
                quizId: 4,
                type: 'multiple-choice',
                question: 'He _______ (give) a promotion last week.',
                options: ['gave', 'was given', 'is given', 'has given'],
                correctAnswer: 'was given',
                explanation: 'Past Simple Passive.',
                difficulty: 'beginner'
            },
            {
                id: 357,
                quizId: 4,
                type: 'multiple-choice',
                question: 'Mistakes _______ (make) by everyone sometimes.',
                options: ['make', 'are made', 'is made', 'was made'],
                correctAnswer: 'are made',
                explanation: 'Present Simple Passive.',
                difficulty: 'beginner'
            },
            {
                id: 358,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'The door _______ (should/lock) at night.',
                options: ['should lock', 'should be locked', 'should locked', 'must lock'],
                correctAnswer: 'should be locked',
                explanation: 'Modal Passive.',
                difficulty: 'intermediate'
            },
            {
                id: 359,
                quizId: 4,
                type: 'multiple-choice',
                question: 'The match _______ (cancel) because of the rain.',
                options: ['cancelled', 'was cancelled', 'is cancelled', 'has cancelled'],
                correctAnswer: 'was cancelled',
                explanation: 'Past Simple Passive.',
                difficulty: 'beginner'
            },
            {
                id: 360,
                quizId: 4,
                type: 'multiple-choice',
                question: 'A lot of money _______ (spend) on advertising.',
                options: ['is spent', 'are spent', 'was spent', 'has spent'],
                correctAnswer: 'is spent',
                explanation: 'Present Simple Passive (Money sayılamaz, tekil fiil alır).',
                difficulty: 'intermediate'
            }
        ]

    },

    // 10. Reported Speech
    {
        topic: GrammarTopic.ReportedSpeech,
        title: 'Reported Speech',
        description: 'Başkasının söylediklerini aktarmayı öğrenin',
        difficulty: 'intermediate',
        estimatedTime: 20,
        icon: '💬',
        color: '#607D8B',
        sections: [
            {
                type: 'theory',
                title: 'Genel Bakış',
                content: `Reported Speech (Dolaylı Anlatım), birinin söylediği sözü başka birine aktarırken kullanılır. Bir sözü aktarırken zamanlar genellikle bir derece geçmişe kayar (**Backshift**).

### 1. Zaman Kayması (Tense Backshift)
- **Present Simple -> Past Simple**: "I like pizza" -> He said he **liked** pizza.
- **Present Cont. -> Past Cont.**: "I am working" -> He said he **was working**.
- **Will -> Would**: "I will help" -> He said he **would** help.
- **Can -> Could**: "I can swim" -> He said he **could** swim.

### 2. Say vs Tell
- **Say**: Yanında kime söylendiği (me, him) yoksa kullanılır. "He **said** (that) he was tired."
- **Tell**: Her zaman kime söylendiğini belirtmelisiniz. "He **told me** (that) he was tired."

### 3. Soru Aktarma (Reported Questions)
Aktarılan sorularda "do/does/did" yardımcı fiilleri atılır ve cümle düz cümle sırasına geçer.
- **Doğrudan**: "Where **do you** live?"
- **Aktarılan**: "He asked where **I lived**." (Düz cümle sırası ve geçmiş zaman).`
            },
            {
                type: 'examples',
                title: 'Doğrudan (Direct) vs Aktarılan (Reported)',
                examples: [
                    { sentence: 'She said, "I am tired." → She said (that) she was tired.', highlight: 'she was tired', explanation: 'Zaman değişimi: am → was, zamir: I → she' },
                    { sentence: 'He said, "I will call you." → He said he would call me.', highlight: 'he would call me', explanation: 'will → would, you → me' },
                    { sentence: 'They said, "We can help." → They said they could help.', highlight: 'they could help', explanation: 'can → could, We → they' }
                ]
            },
            {
                type: 'tips',
                title: 'Sık Yapılan Hatalar',
                tips: [
                    '❌ Zamirleri değiştirmeyi unutmayın: "He said I am tired" → "He said he was tired"',
                    '❌ Zaman değişimini (backshift) unutmayın: "She said she likes it" → "She said she liked it"',
                    '✅ İfade hala doğruysa zaman değişimi yapılmayabilir: "He said Paris is in France." (hala doğru)',
                    '✅ Sorular için "asked" kullanın: She asked if I was ready. / She asked where I lived.'
                ]
            }
        ],
        exercises: [
            {
                id: 361,
                quizId: 1,
                type: 'multiple-choice',
                question: 'She said, "I am busy." → She said she _______ busy.',
                options: ['am', 'is', 'was', 'were'],
                correctAnswer: 'was',
                explanation: 'Backshift: Present Simple (am) → Past Simple (was).',
                difficulty: 'beginner'
            },
            {
                id: 362,
                quizId: 1,
                type: 'multiple-choice',
                question: 'He said, "I will help you." → He said he _______ help me.',
                options: ['will', 'would', 'can', 'could'],
                correctAnswer: 'would',
                explanation: 'Backshift: will → would. Zamir: you → me.',
                difficulty: 'beginner'
            },
            {
                id: 363,
                quizId: 1,
                type: 'multiple-choice',
                question: 'They said, "We are leaving." → They said they _______ leaving.',
                options: ['are', 'were', 'have been', 'had been'],
                correctAnswer: 'were',
                explanation: 'Backshift: Present Continuous (are) → Past Continuous (were).',
                difficulty: 'beginner'
            },
            {
                id: 364,
                quizId: 1,
                type: 'error-correction',
                question: 'She said that she will come tomorrow.',
                correctAnswer: 'She said that she would come the next day.',
                explanation: 'Backshift: will → would. Zaman değişimi: tomorrow → the next day.',
                difficulty: 'intermediate'
            },
            {
                id: 365,
                quizId: 1,
                type: 'multiple-choice',
                question: 'Tom said, "I can swim." → Tom said he _______ swim.',
                options: ['can', 'could', 'will', 'would'],
                correctAnswer: 'could',
                explanation: 'Backshift: can → could.',
                difficulty: 'beginner'
            },
            {
                id: 366,
                quizId: 1,
                type: 'multiple-choice',
                question: 'She said, "I have finished." → She said she _______ finished.',
                options: ['have', 'has', 'had', 'will have'],
                correctAnswer: 'had',
                explanation: 'Backshift: Present Perfect (have finished) → Past Perfect (had finished).',
                difficulty: 'intermediate'
            },
            {
                id: 367,
                quizId: 1,
                type: 'fill-in-blank',
                question: 'He said, "I live in Paris." → He said he _______ (live) in Paris.',
                options: ['live', 'lives', 'lived', 'had lived'],
                correctAnswer: 'lived',
                explanation: 'Backshift: Present Simple (live) → Past Simple (lived).',
                difficulty: 'beginner'
            },
            {
                id: 368,
                quizId: 1,
                type: 'multiple-choice',
                question: 'Mary said, "I saw John yesterday." → Mary said she _______ John _______.',
                options: ['saw...yesterday', 'had seen...the day before', 'has seen...yesterday', 'see...the day before'],
                correctAnswer: 'had seen...the day before',
                explanation: 'Backshift: Past Simple → Past Perfect. Zaman: yesterday → the day before.',
                difficulty: 'intermediate'
            },
            {
                id: 369,
                quizId: 1,
                type: 'multiple-choice',
                question: 'John said, "I am working now." → John said he _______ working _______.',
                options: ['is...now', 'was...now', 'was...then', 'is...then'],
                correctAnswer: 'was...then',
                explanation: 'Backshift: am → was. Zaman: now → then.',
                difficulty: 'intermediate'
            },
            {
                id: 370,
                quizId: 1,
                type: 'error-correction',
                question: 'She told me that she can speak French.',
                correctAnswer: 'She told me that she could speak French.',
                explanation: 'Geçmiş ifadeleri aktarırken backshift yapın: can → could.',
                difficulty: 'intermediate'
            },

            // Quiz 2: Pronouns & Basic Tense Changes
            {
                id: 371,
                quizId: 2,
                type: 'multiple-choice',
                question: 'He said, "I like your hat." → He said he _______ my hat.',
                options: ['likes', 'liked', 'has liked', 'is liking'],
                correctAnswer: 'liked',
                explanation: 'Present Simple → Past Simple. I → he, your → my.',
                difficulty: 'beginner'
            },
            {
                id: 372,
                quizId: 2,
                type: 'multiple-choice',
                question: 'They said, "We are hungry." → They said they _______ hungry.',
                options: ['are', 'were', 'had been', 'will be'],
                correctAnswer: 'were',
                explanation: 'Present Simple → Past Simple. We → they.',
                difficulty: 'beginner'
            },
            {
                id: 373,
                quizId: 2,
                type: 'multiple-choice',
                question: 'She said, "I can help you tomorrow." → She said she _______ help me _______.',
                options: ['can...tomorrow', 'could...the next day', 'would...the next day', 'could...tomorrow'],
                correctAnswer: 'could...the next day',
                explanation: 'can → could, tomorrow → the next day.',
                difficulty: 'intermediate'
            },
            {
                id: 374,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'He said, "I don\'t know the answer." → He said he _______ (not/know) the answer.',
                options: ["doesn't know", "didn't know", "haven't known", "won't know"],
                correctAnswer: "didn't know",
                explanation: 'Present Simple → Past Simple.',
                difficulty: 'beginner'
            },
            {
                id: 375,
                quizId: 2,
                type: 'multiple-choice',
                question: 'They said, "We have a problem." → They said they _______ a problem.',
                options: ['have', 'had', 'have had', 'are having'],
                correctAnswer: 'had',
                explanation: 'Present Simple → Past Simple.',
                difficulty: 'beginner'
            },
            {
                id: 376,
                quizId: 2,
                type: 'multiple-choice',
                question: 'She said, "I\'m staying here." → She said she was staying _______.',
                options: ['here', 'there', 'at home', 'now'],
                correctAnswer: 'there',
                explanation: 'here → there (yer zarfı değişimi).',
                difficulty: 'intermediate'
            },
            {
                id: 377,
                quizId: 2,
                type: 'multiple-choice',
                question: 'He said, "I watched a movie last tonight." → He said he _______ a movie _______ night.',
                options: ['watched...last', 'had watched...that', 'has watched...that', 'watches...last'],
                correctAnswer: 'had watched...that',
                explanation: 'Past Simple → Past Perfect.',
                difficulty: 'intermediate'
            },
            {
                id: 378,
                quizId: 2,
                type: 'multiple-choice',
                question: 'We said, "We are going to win." → We said we _______ going to win.',
                options: ['are', 'were', 'had been', 'will be'],
                correctAnswer: 'were',
                explanation: 'Present Continuous → Past Continuous.',
                difficulty: 'beginner'
            },
            {
                id: 379,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'She said, "I\'ll call you." → She said she _______ call me.',
                options: ['will', 'would', 'can', 'shall'],
                correctAnswer: 'would',
                explanation: 'will → would.',
                difficulty: 'beginner'
            },
            {
                id: 380,
                quizId: 2,
                type: 'multiple-choice',
                question: 'They said, "We can\'t see the stage." → They said they _______ see the stage.',
                options: ["can't", "couldn't", "won't", "didn't"],
                correctAnswer: "couldn't",
                explanation: "can't → couldn't.",
                difficulty: 'beginner'
            },

            // Quiz 3: Reported Questions & Time Phrases
            {
                id: 381,
                quizId: 3,
                type: 'multiple-choice',
                question: 'He asked, "Where do you live?" → He asked me where I _______.',
                options: ['do live', 'live', 'lived', 'had lived'],
                correctAnswer: 'lived',
                explanation: 'Soru aktarırken düz cümle sırasına geçilir ve zaman bir derece geçmişe gider.',
                difficulty: 'intermediate'
            },
            {
                id: 382,
                quizId: 3,
                type: 'multiple-choice',
                question: 'She asked, "Are you okay?" → She asked if I _______ okay.',
                options: ['am', 'is', 'was', 'were'],
                correctAnswer: 'was',
                explanation: 'Yes/No soruları "if" veya "whether" ile aktarılır.',
                difficulty: 'intermediate'
            },
            {
                id: 383,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'He asked, "What time is it?" → He asked what time it _______.',
                options: ['is', 'was', 'were', 'had been'],
                correctAnswer: 'was',
                explanation: 'Soru kelimesi + özne + fiil (düz cümle sırası).',
                difficulty: 'intermediate'
            },
            {
                id: 384,
                quizId: 3,
                type: 'multiple-choice',
                question: 'They asked, "Have you seen my keys?" → They asked if I _______ their keys.',
                options: ['see', 'saw', 'had seen', 'have seen'],
                correctAnswer: 'had seen',
                explanation: 'Present Perfect → Past Perfect.',
                difficulty: 'intermediate'
            },
            {
                id: 385,
                quizId: 3,
                type: 'multiple-choice',
                question: 'She asked, "Why are you crying?" → She asked me why I _______ crying.',
                options: ['am', 'was', 'were', 'have been'],
                correctAnswer: 'was',
                explanation: 'Present Continuous → Past Continuous.',
                difficulty: 'intermediate'
            },
            {
                id: 386,
                quizId: 3,
                type: 'multiple-choice',
                question: 'He asked, "Can you swim?" → He asked if I _______ swim.',
                options: ['can', 'could', 'should', 'would'],
                correctAnswer: 'could',
                explanation: 'can → could.',
                difficulty: 'intermediate'
            },
            {
                id: 387,
                quizId: 3,
                type: 'multiple-choice',
                question: 'She said, "I visited them two days ago." → She said she had visited them two days _______.',
                options: ['ago', 'before', 'then', 'after'],
                correctAnswer: 'before',
                explanation: 'ago → before.',
                difficulty: 'intermediate'
            },
            {
                id: 388,
                quizId: 3,
                type: 'multiple-choice',
                question: 'He said, "I am meeting them today." → He said he was meeting them _______.',
                options: ['today', 'that day', 'yesterday', 'tomorrow'],
                correctAnswer: 'that day',
                explanation: 'today → that day.',
                difficulty: 'intermediate'
            },
            {
                id: 389,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'She asked, "Will you be there?" → She asked if I _______ be there.',
                options: ['will', 'would', 'shall', 'could'],
                correctAnswer: 'would',
                explanation: 'will → would.',
                difficulty: 'intermediate'
            },
            {
                id: 390,
                quizId: 3,
                type: 'multiple-choice',
                question: 'They asked, "What did you buy?" → They asked me what I _______.',
                options: ['buy', 'bought', 'had bought', 'have bought'],
                correctAnswer: 'had bought',
                explanation: 'Past Simple Question → Past Perfect.',
                difficulty: 'advanced'
            },

            // Quiz 4: Commands & Advanced Reporting
            {
                id: 391,
                quizId: 4,
                type: 'multiple-choice',
                question: 'The teacher said, "Close your books." → The teacher told us _______ our books.',
                options: ['close', 'to close', 'closing', 'closed'],
                correctAnswer: 'to close',
                explanation: 'Emir cümleleri "tell + nesne + to + fiil" ile aktarılır.',
                difficulty: 'intermediate'
            },
            {
                id: 392,
                quizId: 4,
                type: 'multiple-choice',
                question: 'He said, "Don\'t wait for me." → He told me _______ for him.',
                options: ["don't wait", 'not wait', 'not to wait', 'to not wait'],
                correctAnswer: 'not to wait',
                explanation: 'Olumsuz emirler "not to + fiil" ile aktarılır.',
                difficulty: 'intermediate'
            },
            {
                id: 393,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'She suggested _______ (go) to the cinema.',
                options: ['to go', 'going', 'go', 'went'],
                correctAnswer: 'going',
                explanation: '"Suggest" fiilinden sonra fiil gelirse -ing alır (veya that clause).',
                difficulty: 'advanced'
            },
            {
                id: 394,
                quizId: 4,
                type: 'multiple-choice',
                question: 'The doctor said, "You should eat more fruit." → The doctor advised me _______ more fruit.',
                options: ['eat', 'to eat', 'eating', 'ate'],
                correctAnswer: 'to eat',
                explanation: 'Advise + nesne + to + fiil.',
                difficulty: 'intermediate'
            },
            {
                id: 395,
                quizId: 4,
                type: 'multiple-choice',
                question: 'He said, "Congratulations! You passed." → He _______ me on passing.',
                options: ['said', 'told', 'congratulated', 'advised'],
                correctAnswer: 'congratulated',
                explanation: 'Bazı durumlar özel fiillerle aktarılır.',
                difficulty: 'advanced'
            },
            {
                id: 396,
                quizId: 4,
                type: 'multiple-choice',
                question: 'She said, "I\'m sorry I\'m late." → She _______ for being late.',
                options: ['said', 'told', 'apologized', 'explained'],
                correctAnswer: 'apologized',
                explanation: 'Özür dileme durumunda "apologize" kullanılır.',
                difficulty: 'advanced'
            },
            {
                id: 397,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'The police officer _______ me to show my ID.',
                options: ['ordered', 'said', 'spoke', 'suggested'],
                correctAnswer: 'ordered',
                explanation: 'Resmi emirler için "order" kullanılır.',
                difficulty: 'intermediate'
            },
            {
                id: 398,
                quizId: 4,
                type: 'multiple-choice',
                question: 'He promised _______ (call) me later.',
                options: ['call', 'to call', 'calling', 'will call'],
                correctAnswer: 'to call',
                explanation: 'Promise + to + fiil.',
                difficulty: 'intermediate'
            },
            {
                id: 399,
                quizId: 4,
                type: 'multiple-choice',
                question: 'They refused _______ (help) us.',
                options: ['help', 'to help', 'helping', 'helped'],
                correctAnswer: 'to help',
                explanation: 'Refuse + to + fiil.',
                difficulty: 'intermediate'
            },
            {
                id: 400,
                quizId: 4,
                type: 'multiple-choice',
                question: 'She warned me _______ (not/touch) the wire.',
                options: ["don't touch", 'not touch', 'not to touch', 'to not touch'],
                correctAnswer: 'not to touch',
                explanation: 'Warn + nesne + not to + fiil.',
                difficulty: 'intermediate'
            }
        ]

    },

    // 11. Question Formation
    {
        topic: GrammarTopic.QuestionFormation,
        title: 'Question Formation',
        description: 'Evet/Hayır soruları, wh- soruları ve soru eklerini öğrenin',
        difficulty: 'beginner', estimatedTime: 20,
        icon: '❓',
        color: '#FF5722',
        sections: [
            {
                type: 'theory',
                title: 'Genel Bakış',
                content: `Question Formation (Soru Kurma), İngilizcede kelime diziminin değiştiği önemli bir konudur.

### 1. Yes/No Soruları (Evet/Hayır)
- **Be Fiili (am/is/are/was/were)**: Özne ile yer değiştirir. "You are ready." -> "**Are you** ready?"
- **Diğer Fiiller**: Başa **Do / Does / Did** gelir. "**Do you** like coffee?" (**Like you** coffee olmaz!)
- **Modallar**: Başa gelir. "**Can you** help me?"

### 2. Wh- Soruları (Ne, Nerede, Neden...)
**Yapı**: Soru Kelimesi + Yardımcı Fiil + Özne + Fiil
- "**Where do you** live?"
- "**What are you** doing?"

### 3. Özne Soruları (Önemli İstisna!)
Eğer soru kelimesi (Who/What) cümlenin **öznesini** soruyorsa, yardımcı fiil (do/does/did) kullanılmaz.
- **Normal Soru**: "Who **did you** call?" (Kimi aradın? - Nesne sorusu)
- **Özne Sorusu**: "**Who called** you?" (Seni kim aradı? - Özne sorusu, do/did yok!)

### 4. Question Tags (Onay Soruları)
Cümlenin sonuna eklenen ve onay isteyen kısa sorulardır.
- "You are coming, **aren't you**?" (Olumlu cümle -> Olumsuz ek).
- "He doesn't like it, **does he**?" (Olumsuz cümle -> Olumlu ek).`
            },
            {
                type: 'examples',
                title: 'Soru Tipleri',
                examples: [
                    { sentence: 'Are you a student?', highlight: 'Are you', explanation: 'Yes/No sorusu "be" ile - özne ve fiil yer değiştirir' },
                    { sentence: 'Do you speak English?', highlight: 'Do you speak', explanation: 'Yes/No sorusu - do + özne + yalın fiil' },
                    { sentence: 'Where do you live?', highlight: 'Where do you live', explanation: 'Wh- sorusu - soru kelimesi + do + özne + fiil' },
                    { sentence: 'You like pizza, don\'t you?', highlight: 'don\'t you', explanation: 'Question tag - olumlu cümle, olumsuz takı' }
                ]
            },
            {
                type: 'tips',
                title: 'Sık Yapılan Hatalar',
                tips: [
                    '❌ Özne sorularında yardımcı fiil kullanmayın: "Who did call?" → "Who called?"',
                    '❌ Yer değiştirmeyi (inversion) unutmayın: "Where you live?" → "Where do you live?"',
                    '❌ Olumlu cümleyle olumlu takı kullanmayın: "You like it, do you?" → "...don\'t you?"',
                    '✅ Cümle ve takıda aynı zamanı kullanın: "She worked, didn\'t she?" (doesn\'t değil)',
                    '✅ Do/Does/Did\'den sonra her zaman yalın fiil kullanın: "Does she works?" → "Does she work?"'
                ]
            }
        ],
        exercises: [
            {
                id: 401,
                quizId: 1,
                type: 'multiple-choice',
                question: '_______ you like coffee?',
                options: ['Are', 'Do', 'Does', 'Is'],
                correctAnswer: 'Do',
                explanation: '"Like" fiili ile (be değil) Yes/No sorusu "do" + özne + yalın fiil kullanır.',
                difficulty: 'beginner'
            },
            {
                id: 402,
                quizId: 1,
                type: 'multiple-choice',
                question: 'Where _______ she work?',
                options: ['do', 'does', 'is', 'are'],
                correctAnswer: 'does',
                explanation: 'Üçüncü tekil şahıs (she) için Wh- sorularında "does" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 403,
                quizId: 1,
                type: 'error-correction',
                question: 'Where you live?',
                correctAnswer: 'Where do you live?',
                explanation: 'Wh- soruları özneden önce "do/does/did" yardımcı fiilini gerektirir.',
                difficulty: 'beginner'
            },
            {
                id: 404,
                quizId: 1,
                type: 'multiple-choice',
                question: 'You are ready, _______?',
                options: ['are you', "aren't you", 'do you', "don't you"],
                correctAnswer: "aren't you",
                explanation: 'Olumlu cümle → olumsuz soru takısı. Aynı yardımcı fiili (are) kullanın.',
                difficulty: 'intermediate'
            },
            {
                id: 405,
                quizId: 1,
                type: 'multiple-choice',
                question: 'Who _______ the window?',
                options: ['broke', 'did break', 'was broke', 'breaking'],
                correctAnswer: 'broke',
                explanation: 'Özne sorusu (who = özne) yardımcı fiil kullanmaz. Doğrudan fiili kullanın.',
                difficulty: 'intermediate'
            },
            {
                id: 406,
                quizId: 1,
                type: 'multiple-choice',
                question: '_______ is your name?',
                options: ['Who', 'What', 'Where', 'How'],
                correctAnswer: 'What',
                explanation: 'İsim sormak için "What" kullanın, "Who" değil.',
                difficulty: 'beginner'
            },
            {
                id: 407,
                quizId: 1,
                type: 'multiple-choice',
                question: "She doesn't like tea, _______?",
                options: ["doesn't she", 'does she', "isn't she", 'is she'],
                correctAnswer: 'does she',
                explanation: 'Olumsuz cümle → olumlu soru takısı. Aynı yardımcı fiil (does).',
                difficulty: 'intermediate'
            },
            {
                id: 408,
                quizId: 1,
                type: 'error-correction',
                question: 'When did you came home?',
                correctAnswer: 'When did you come home?',
                explanation: '"Did"den sonra geçmiş zaman (came) değil, yalın fiil (come) kullanın.',
                difficulty: 'intermediate'
            },
            {
                id: 409,
                quizId: 1,
                type: 'multiple-choice',
                question: '_______ old are you?',
                options: ['What', 'Who', 'How', 'Where'],
                correctAnswer: 'How',
                explanation: 'Yaş sormak için "How old" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 410,
                quizId: 1,
                type: 'fill-in-blank',
                question: 'They have finished, _______ _______?',
                options: ["haven't they", "don't they", "didn't they", "aren't they"],
                correctAnswer: "haven't they",
                explanation: '"Have" ile kurulan olumlu cümle → "haven\'t they" (olumsuz takı).',
                difficulty: 'intermediate'
            },

            // Quiz 2: Wh- Questions & Word Order
            {
                id: 411,
                quizId: 2,
                type: 'multiple-choice',
                question: '_______ color do you like?',
                options: ['Who', 'What', 'Where', 'How'],
                correctAnswer: 'What',
                explanation: 'Nesneleri sormak için "What" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 412,
                quizId: 2,
                type: 'multiple-choice',
                question: 'Why _______ you late yesterday?',
                options: ['do', 'did', 'was', 'were'],
                correctAnswer: 'were',
                explanation: 'Geçmiş zaman "be" fiili (you için were).',
                difficulty: 'beginner'
            },
            {
                id: 413,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'How _______ (do/does) your sister go to school?',
                options: ['do', 'does', 'is', 'did'],
                correctAnswer: 'does',
                explanation: 'Üçüncü tekil şahıs (sister) için "does".',
                difficulty: 'beginner'
            },
            {
                id: 414,
                quizId: 2,
                type: 'multiple-choice',
                question: '_______ often do you exercise?',
                options: ['What', 'Where', 'How', 'Who'],
                correctAnswer: 'How',
                explanation: 'Sıklık sormak için "How often" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 415,
                quizId: 2,
                type: 'multiple-choice',
                question: 'What _______ you doing when I called?',
                options: ['do', 'did', 'was', 'were'],
                correctAnswer: 'were',
                explanation: 'Past Continuous soru yapısı.',
                difficulty: 'intermediate'
            },
            {
                id: 416,
                quizId: 2,
                type: 'fill-in-blank',
                question: '_______ (Where/What) are you from?',
                options: ['Where', 'What', 'Who', 'How'],
                correctAnswer: 'Where',
                explanation: 'Nereli olduğunuzu sormak için "Where ... from" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 417,
                quizId: 2,
                type: 'multiple-choice',
                question: '_______ you seen my phone?',
                options: ['Do', 'Did', 'Have', 'Has'],
                correctAnswer: 'Have',
                explanation: 'Present Perfect soru yapısı.',
                difficulty: 'beginner'
            },
            {
                id: 418,
                quizId: 2,
                type: 'multiple-choice',
                question: 'Which book _______ you like better?',
                options: ['do', 'does', 'is', 'are'],
                correctAnswer: 'do',
                explanation: 'Present Simple (you için do).',
                difficulty: 'beginner'
            },
            {
                id: 419,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'How _______ (much/many) does this cost?',
                options: ['much', 'many', 'long', 'often'],
                correctAnswer: 'much',
                explanation: 'Fiyat sormak için "How much" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 420,
                quizId: 2,
                type: 'multiple-choice',
                question: '_______ did you go on vacation?',
                options: ['Where', 'What', 'Who', 'How'],
                correctAnswer: 'Where',
                explanation: 'Yer sormak için "Where".',
                difficulty: 'beginner'
            },

            // Quiz 3: Question Tags & Short Answers
            {
                id: 421,
                quizId: 3,
                type: 'multiple-choice',
                question: "You haven't seen her, _______?",
                options: ['have you', "haven't you", 'did you', "didn't you"],
                correctAnswer: 'have you',
                explanation: 'Olumsuz cümle → olumlu takı.',
                difficulty: 'intermediate'
            },
            {
                id: 422,
                quizId: 3,
                type: 'multiple-choice',
                question: 'He can sing well, _______?',
                options: ['can her', "can't he", 'does he', "doesn't he"],
                correctAnswer: "can't he",
                explanation: 'Olumlu cümle → olumsuz takı (can).',
                difficulty: 'beginner'
            },
            {
                id: 423,
                quizId: 3,
                type: 'fill-in-blank',
                question: "They'll be here soon, _______ they?",
                options: ["won't", "don't", "aren't", "shan't"],
                correctAnswer: "won't",
                explanation: 'will → won\'t.',
                difficulty: 'intermediate'
            },
            {
                id: 424,
                quizId: 3,
                type: 'multiple-choice',
                question: "You like music, _______?",
                options: ['do you', "don't you", 'are you', "aren't you"],
                correctAnswer: "don't you",
                explanation: 'Present Simple → don\'t you.',
                difficulty: 'beginner'
            },
            {
                id: 425,
                quizId: 3,
                type: 'multiple-choice',
                question: 'It was a great day, _______?',
                options: ['was it', "wasn't it", 'is it', "isn't it"],
                correctAnswer: "wasn't it",
                explanation: 'Past Simple "be" → wasn\'t it.',
                difficulty: 'beginner'
            },
            {
                id: 426,
                quizId: 3,
                type: 'fill-in-blank',
                question: "She doesn't work here, _______ _______?",
                options: ['does she', "doesn't she", 'is she', "isn't she"],
                correctAnswer: 'does she',
                explanation: 'Olumsuz → olumlu.',
                difficulty: 'beginner'
            },
            {
                id: 427,
                quizId: 3,
                type: 'multiple-choice',
                question: "There's a lot of traffic, _______?",
                options: ["is there", "isn't there", "is it", "isn't it"],
                correctAnswer: "isn't there",
                explanation: '"There is" yapısı "isn\'t there" ile devam eder.',
                difficulty: 'intermediate'
            },
            {
                id: 428,
                quizId: 3,
                type: 'multiple-choice',
                question: 'We should leave now, _______?',
                options: ['should we', "shouldn't we", 'do we', "don't we"],
                correctAnswer: "shouldn't we",
                explanation: 'should → shouldn\'t.',
                difficulty: 'beginner'
            },
            {
                id: 429,
                quizId: 3,
                type: 'fill-in-blank',
                question: "I'm late, _______ I?",
                options: ['am I', "am not I", "ain't I", "aren't I"],
                correctAnswer: "aren't I",
                explanation: '"I am" için istisnai soru takısı "aren\'t I" dır.',
                difficulty: 'advanced'
            },
            {
                id: 430,
                quizId: 3,
                type: 'multiple-choice',
                question: "Let's go, _______ we?",
                options: ['will', 'shall', 'do', 'should'],
                correctAnswer: 'shall',
                explanation: '"Let\'s" ile başlayan cümlelerde "shall we" kullanılır.',
                difficulty: 'advanced'
            },

            // Quiz 4: Subject Questions & Advanced Structures
            {
                id: 431,
                quizId: 4,
                type: 'multiple-choice',
                question: '_______ wrote that book?',
                options: ['Who', 'Who did', 'Whom', 'What'],
                correctAnswer: 'Who',
                explanation: 'Özne sorusu: yardımcı fiil (did) kullanılmaz.',
                difficulty: 'intermediate'
            },
            {
                id: 432,
                quizId: 4,
                type: 'multiple-choice',
                question: '_______ happened at the party?',
                options: ['What', 'What did', 'Which', 'How'],
                correctAnswer: 'What',
                explanation: 'Özne sorusu (What = özne).',
                difficulty: 'intermediate'
            },
            {
                id: 433,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'Do you know _______ (where/where is) the station?',
                options: ['where is', 'where', 'where the station is', 'is where'],
                correctAnswer: 'where the station is',
                explanation: 'Dolaylı soru (Indirect question) düz cümle sırası gerektirir.',
                difficulty: 'advanced'
            },
            {
                id: 434,
                quizId: 4,
                type: 'multiple-choice',
                question: '_______ of these colors do you prefer?',
                options: ['What', 'Which', 'How', 'Who'],
                correctAnswer: 'Which',
                explanation: 'Seçenekler arasından seçim yaparken "Which" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 435,
                quizId: 4,
                type: 'multiple-choice',
                question: 'Can you tell me _______ _______?',
                options: ['what time is it', 'what time it is', 'is it what time', 'time what is it'],
                correctAnswer: 'what time it is',
                explanation: 'Dolaylı soru yapısı.',
                difficulty: 'advanced'
            },
            {
                id: 436,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'Who _______ (invent) the telephone?',
                options: ['did invent', 'invented', 'was invented', 'invent'],
                correctAnswer: 'invented',
                explanation: 'Özne sorusu (Past Simple).',
                difficulty: 'intermediate'
            },
            {
                id: 437,
                quizId: 4,
                type: 'multiple-choice',
                question: 'I wonder _______ _______ coming.',
                options: ['who is', 'who', 'is who', 'who are'],
                correctAnswer: 'who is',
                explanation: 'Dolaylı soru.',
                difficulty: 'intermediate'
            },
            {
                id: 438,
                quizId: 4,
                type: 'multiple-choice',
                question: '_______ did you give the gift to?',
                options: ['Who', 'What', 'Which', 'How'],
                correctAnswer: 'Who',
                explanation: 'Nesne sorusu (Whom daha resmi olsa da Who yaygındır).',
                difficulty: 'beginner'
            },
            {
                id: 439,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'How _______ (long/far) is it to the airport?',
                options: ['long', 'far', 'often', 'much'],
                correctAnswer: 'far',
                explanation: 'Mesafe sormak için "How far" kullanılır.',
                difficulty: 'beginner'
            },
            {
                id: 440,
                quizId: 4,
                type: 'multiple-choice',
                question: '_______ _______ you waiting for?',
                options: ['Who are', 'What do', 'Where is', 'Who do'],
                correctAnswer: 'Who are',
                explanation: 'Present Continuous nesne sorusu.',
                difficulty: 'beginner'
            }
        ]

    },

    // 12. Phrasal Verbs
    {
        topic: GrammarTopic.PhrasalVerbs,
        title: 'Phrasal Verbs',
        description: 'IELTS için yaygın Phrasal Verb\'leri öğrenin',
        difficulty: 'intermediate',
        estimatedTime: 25,
        icon: '🔤',
        color: '#009688',
        sections: [
            {
                type: 'theory',
                title: 'Genel Bakış',
                content: `Phrasal Verbs, bir fiil ile bir edatın (up, down, off, on vb.) birleşerek **yeni bir anlam** oluşturmasıdır. İngilizcenin en doğal ama en zorlu parçalarından biridir.

### 1. Mantığı Anlamak
Bazı edatlar phrasal verb'e belli bir yön katabilir:
- **UP (Daha fazla / Tamamlama)**: *Turn up* (Sesi açmak), *Clean up* (Tamamen temizlemek).
- **DOWN (Daha az / Durma)**: *Turn down* (Sesi kısmak), *Settle down* (Durulmak).
- **OFF (Ayrılma)**: *Take off* (Uçağın kalkması), *Get off* (İnmek).

### 2. Ayrılabilir mi? (Separable vs Inseparable)
Bazı fiillerin arasına nesne girebilir, bazıları ise hiç ayrılmaz.
- **Ayrılabilir**: "Turn **the light** off" VEYA "Turn off **the light**."
- **Ayrılmaz**: "Look after **the baby**." (*Look the baby after* diyemezsiniz).

> [!TIP]
> **IELTS Notu**: Akademik sınavlarda Phrasal Verb kullanmak konuşmanızı ve yazmanızı daha doğal (idiomatic) gösterir. Ancak anlamından emin olmadıklarınızı kullanmaktan kaçının.`
            },
            {
                type: 'examples',
                title: 'Yaygın Phrasal Verb\'ler',
                examples: [
                    { sentence: 'I got up at 7 AM.', highlight: 'got up', explanation: 'Get up = uyanmak ve yataktan kalkmak' },
                    { sentence: 'She gave up smoking.', highlight: 'gave up', explanation: 'Give up = bir şeyi yapmayı bırakmak/vazgeçmek' },
                    { sentence: 'Please turn off the TV.', highlight: 'turn off', explanation: 'Turn off = bir cihazı kapatmak' },
                    { sentence: 'I need to look after my sister.', highlight: 'look after', explanation: 'Look after = göz kulak olmak/bakmak' }
                ]
            },
            {
                type: 'tips',
                title: 'Sık Kullanılan IELTS Phrasal Verb\'leri',
                tips: [
                    '✅ Call off = cancel (iptal etmek): "They called off the meeting."',
                    '✅ Carry out = perform/conduct (yürütmek/yapmak): "carry out research"',
                    '✅ Come across = find by chance (denk gelmek): "I came across an old photo."',
                    '✅ Deal with = handle (başa çıkmak/ilgilenmek): "deal with problems"',
                    '✅ Figure out = understand/solve (çözmek/anlamak): "figure out the answer"',
                    '✅ Get on with = have good relationship (iyi geçinmek): "get on with colleagues"',
                    '✅ Look forward to = anticipate with pleasure (dört gözle beklemek): "I look forward to meeting you."',
                    '✅ Put off = postpone (ertelemek): "put off the meeting"',
                    '✅ Run out of = exhaust supply (tükenmek): "run out of time/money"',
                    '✅ Take after = resemble (benzemek - aile): "She takes after her mother."'
                ]
            }
        ],
        exercises: [
            {
                id: 441,
                quizId: 1,
                type: 'multiple-choice',
                question: 'I _______ at 6 AM every day.',
                options: ['get up', 'get on', 'get off', 'get over'],
                correctAnswer: 'get up',
                explanation: '"Get up", uyanmak ve yataktan kalkmak demektir.',
                difficulty: 'beginner'
            },
            {
                id: 442,
                quizId: 1,
                type: 'multiple-choice',
                question: 'Please _______ the form and send it back.',
                options: ['fill in', 'fill on', 'fill at', 'fill with'],
                correctAnswer: 'fill in',
                explanation: '"Fill in", bir formu doldurmak demektir.',
                difficulty: 'beginner'
            },
            {
                id: 443,
                quizId: 1,
                type: 'multiple-choice',
                question: 'They decided to _______ the wedding due to rain.',
                options: ['call in', 'call off', 'call up', 'call on'],
                correctAnswer: 'call off',
                explanation: '"Call off", bir etkinliği iptal etmek demektir.',
                difficulty: 'intermediate'
            },
            {
                id: 444,
                quizId: 1,
                type: 'multiple-choice',
                question: 'I need to _______ my younger brother while my parents are away.',
                options: ['look at', 'look for', 'look after', 'look into'],
                correctAnswer: 'look after',
                explanation: '"Look after", birine bakmak/göz kulak olmak demektir.',
                difficulty: 'beginner'
            },
            {
                id: 445,
                quizId: 1,
                type: 'error-correction',
                question: 'Please turn the light off it.',
                correctAnswer: 'Please turn off the light.',
                explanation: 'Ayrılabilir fiiller: "turn off the light" veya "turn the light off", ancak nesne (it) cümlenin sonunda fazladan kullanılmaz.',
                difficulty: 'intermediate'
            },
            {
                id: 446,
                quizId: 1,
                type: 'multiple-choice',
                question: 'She _______ smoking last year.',
                options: ['gave up', 'gave in', 'gave away', 'gave back'],
                correctAnswer: 'gave up',
                explanation: '"Give up", bir alışkanlığı bırakmak demektir.',
                difficulty: 'intermediate'
            },
            {
                id: 447,
                quizId: 1,
                type: 'multiple-choice',
                question: 'We _______ coffee. Can you buy some?',
                options: ['ran out of', 'ran into', 'ran over', 'ran up'],
                correctAnswer: 'ran out of',
                explanation: '"Run out of", bir şeyin tükenmesi/kalmaması demektir.',
                difficulty: 'intermediate'
            },
            {
                id: 448,
                quizId: 1,
                type: 'multiple-choice',
                question: "I'm _______ my vacation next month.",
                options: ['looking up to', 'looking down on', 'looking forward to', 'looking into'],
                correctAnswer: 'looking forward to',
                explanation: '"Look forward to", bir şeyi dört gözle beklemek demektir. "to + -ing" veya isim gelir.',
                difficulty: 'intermediate'
            },
            {
                id: 449,
                quizId: 1,
                type: 'fill-in-blank',
                question: 'The meeting was _______ (postpone) until next week.',
                options: ['put off', 'put on', 'put up', 'put down'],
                correctAnswer: 'put off',
                explanation: '"Put off", ertelemek (postpone) demektir.',
                difficulty: 'intermediate'
            },
            {
                id: 450,
                quizId: 1,
                type: 'multiple-choice',
                question: 'I _______ an old friend at the mall yesterday.',
                options: ['came across', 'came about', 'came along', 'came down'],
                correctAnswer: 'came across',
                explanation: '"Come across", şans eseri karşılaşmak/bulmak demektir.',
                difficulty: 'intermediate'
            },

            // Quiz 2: Daily Life Phrasal Verbs
            {
                id: 451,
                quizId: 2,
                type: 'multiple-choice',
                question: 'Wait! Don\'t _______ the phone yet.',
                options: ['hang up', 'hang on', 'hang out', 'hang in'],
                correctAnswer: 'hang up',
                explanation: 'Telefonu kapatmak: hang up.',
                difficulty: 'beginner'
            },
            {
                id: 452,
                quizId: 2,
                type: 'multiple-choice',
                question: 'I need to _______ these old clothes.',
                options: ['throw away', 'throw up', 'throw in', 'throw out'],
                correctAnswer: 'throw away',
                explanation: 'Bir şeyi atmak/çıkarmak: throw away / throw out.',
                difficulty: 'beginner'
            },
            {
                id: 453,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'Could you _______ (turn) the music down?',
                options: ['turn', 'take', 'put', 'get'],
                correctAnswer: 'turn',
                explanation: 'Sesi kısmak: turn down.',
                difficulty: 'beginner'
            },
            {
                id: 454,
                quizId: 2,
                type: 'multiple-choice',
                question: 'We _______ the bus and walked home.',
                options: ['got off', 'got on', 'got in', 'got out'],
                correctAnswer: 'got off',
                explanation: 'Otobüs, tren gibi araçlardan inmek: get off.',
                difficulty: 'beginner'
            },
            {
                id: 455,
                quizId: 2,
                type: 'multiple-choice',
                question: 'She _______ her coat and went inside.',
                options: ['took off', 'took in', 'took up', 'took out'],
                correctAnswer: 'took off',
                explanation: 'Kıyafet çıkarmak: take off.',
                difficulty: 'beginner'
            },
            {
                id: 456,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'I can\'t _______ (find) the meaning of this word.',
                options: ['look up', 'look for', 'look after', 'look at'],
                correctAnswer: 'look up',
                explanation: 'Sözlükten/internetten bir şeye bakmak: look up.',
                difficulty: 'beginner'
            },
            {
                id: 457,
                quizId: 2,
                type: 'multiple-choice',
                question: 'Please _______ your shoes before entering.',
                options: ['take off', 'take on', 'take in', 'take out'],
                correctAnswer: 'take off',
                explanation: 'Ayakkabı çıkarmak: take off.',
                difficulty: 'beginner'
            },
            {
                id: 458,
                quizId: 2,
                type: 'multiple-choice',
                question: 'I _______ my glasses everywhere.',
                options: ['looked for', 'looked after', 'looked into', 'looked up'],
                correctAnswer: 'looked for',
                explanation: 'Bir şeyi aramak: look for.',
                difficulty: 'beginner'
            },
            {
                id: 459,
                quizId: 2,
                type: 'fill-in-blank',
                question: 'Don\'t _______ (stop trying)!',
                options: ['give up', 'give in', 'give out', 'give back'],
                correctAnswer: 'give up',
                explanation: 'Vazgeçmek: give up.',
                difficulty: 'beginner'
            },
            {
                id: 460,
                quizId: 2,
                type: 'multiple-choice',
                question: 'He _______ the radio to listen to the news.',
                options: ['turned on', 'turned off', 'turned up', 'turned down'],
                correctAnswer: 'turned on',
                explanation: 'Bir cihazı açmak: turned on.',
                difficulty: 'beginner'
            },

            // Quiz 3: Intermediate Phrasal Verbs
            {
                id: 461,
                quizId: 3,
                type: 'multiple-choice',
                question: 'The plane _______ late because of the fog.',
                options: ['took off', 'took in', 'took up', 'took out'],
                correctAnswer: 'took off',
                explanation: 'Uçağın kalkması: take off.',
                difficulty: 'intermediate'
            },
            {
                id: 462,
                quizId: 3,
                type: 'multiple-choice',
                question: 'I _______ an old friend yesterday.',
                options: ['ran into', 'ran out of', 'ran over', 'ran up'],
                correctAnswer: 'ran into',
                explanation: 'Şans eseri karşılaşmak: ran into / came across.',
                difficulty: 'intermediate'
            },
            {
                id: 463,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'We have _______ (spent all) our money.',
                options: ['run out of', 'run into', 'run away', 'run through'],
                correctAnswer: 'run out of',
                explanation: 'Bitmek/tükenmek: run out of.',
                difficulty: 'intermediate'
            },
            {
                id: 464,
                quizId: 3,
                type: 'multiple-choice',
                question: 'Can you _______ the meaning of this sentence?',
                options: ['figure out', 'figure in', 'figure up', 'figure on'],
                correctAnswer: 'figure out',
                explanation: 'Bir şeyi anlamak/çözmek: figure out.',
                difficulty: 'intermediate'
            },
            {
                id: 465,
                quizId: 3,
                type: 'multiple-choice',
                question: 'She _______ her father.',
                options: ['takes after', 'takes in', 'takes up', 'takes off'],
                correctAnswer: 'takes after',
                explanation: 'Birine benzemek (huyları/görünüşü): takes after.',
                difficulty: 'intermediate'
            },
            {
                id: 466,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'I _______ (decided not to do) the race.',
                options: ['backed out of', 'backed up', 'backed down', 'backed into'],
                correctAnswer: 'backed out of',
                explanation: 'Bir sözden/karardan caymak: back out of.',
                difficulty: 'advanced'
            },
            {
                id: 467,
                quizId: 3,
                type: 'multiple-choice',
                question: 'The business _______ last year.',
                options: ['set up', 'set off', 'set in', 'set out'],
                correctAnswer: 'set up',
                explanation: 'Bir iş/kurum kurmak: set up.',
                difficulty: 'intermediate'
            },
            {
                id: 468,
                quizId: 3,
                type: 'multiple-choice',
                question: 'He _______ his story to impress her.',
                options: ['made up', 'made out', 'made off', 'made for'],
                correctAnswer: 'made up',
                explanation: 'Hikaye/yalan uydurmak: make up.',
                difficulty: 'intermediate'
            },
            {
                id: 469,
                quizId: 3,
                type: 'fill-in-blank',
                question: 'I can\'t _______ (resist) his sweet talk.',
                options: ['give in to', 'give up', 'give out', 'give away'],
                correctAnswer: 'give in to',
                explanation: 'Teslim olmak/boyun eğmek: give in to.',
                difficulty: 'advanced'
            },
            {
                id: 470,
                quizId: 3,
                type: 'multiple-choice',
                question: 'They _______ the old building.',
                options: ['blew up', 'blew out', 'blew off', 'blew away'],
                correctAnswer: 'blew up',
                explanation: 'Patlatmak: blew up.',
                difficulty: 'intermediate'
            },

            // Quiz 4: Mixed Phrasal Verbs
            {
                id: 471,
                quizId: 4,
                type: 'multiple-choice',
                question: 'Please _______ the radio; it\'s too loud.',
                options: ['turn down', 'turn up', 'turn off', 'turn in'],
                correctAnswer: 'turn down',
                explanation: 'Sesi kısmak.',
                difficulty: 'beginner'
            },
            {
                id: 472,
                quizId: 4,
                type: 'multiple-choice',
                question: 'He _______ his best friend.',
                options: ['let down', 'let in', 'let out', 'let on'],
                correctAnswer: 'let down',
                explanation: 'Birini hayal kırıklığına uğratmak: let down.',
                difficulty: 'intermediate'
            },
            {
                id: 473,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'The car _______ (stopped working) on the way.',
                options: ['broke down', 'broke up', 'broke out', 'broke in'],
                correctAnswer: 'broke down',
                explanation: 'Araba/makine bozulması: broke down.',
                difficulty: 'beginner'
            },
            {
                id: 474,
                quizId: 4,
                type: 'multiple-choice',
                question: 'She _______ early to finish the work.',
                options: ['carried on', 'carried out', 'carried off', 'carried away'],
                correctAnswer: 'carried on',
                explanation: 'Bir şeye devam etmek: carry on.',
                difficulty: 'intermediate'
            },
            {
                id: 475,
                quizId: 4,
                type: 'multiple-choice',
                question: 'I hope the weather _______ soon.',
                options: ['clears up', 'clears out', 'clears off', 'clears in'],
                correctAnswer: 'clears up',
                explanation: 'Havanın düzelmesi/açması: clear up.',
                difficulty: 'intermediate'
            },
            {
                id: 476,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'He _______ (arrived) late for the interview.',
                options: ['showed up', 'showed off', 'showed out', 'showed in'],
                correctAnswer: 'showed up',
                explanation: 'Bir yere varmak/gelmek: show up / turn up.',
                difficulty: 'intermediate'
            },
            {
                id: 477,
                quizId: 4,
                type: 'multiple-choice',
                question: 'They _______ after five years together.',
                options: ['broke up', 'broke down', 'broke out', 'broke in'],
                correctAnswer: 'broke up',
                explanation: 'İlişkiyi bitirmek: break up.',
                difficulty: 'beginner'
            },
            {
                id: 478,
                quizId: 4,
                type: 'multiple-choice',
                question: 'We _______ some interesting facts.',
                options: ['found out', 'found in', 'found up', 'found off'],
                correctAnswer: 'found out',
                explanation: 'Bir şeyi öğrenmek/bulmak: find out.',
                difficulty: 'beginner'
            },
            {
                id: 479,
                quizId: 4,
                type: 'fill-in-blank',
                question: 'I _______ (started) a new hobby.',
                options: ['took up', 'took off', 'took in', 'took after'],
                correctAnswer: 'took up',
                explanation: 'Yeni bir hobiye/uğraşa başlamak: take up.',
                difficulty: 'intermediate'
            },
            {
                id: 480,
                quizId: 4,
                type: 'multiple-choice',
                question: 'The fire _______ during the night.',
                options: ['went out', 'went on', 'went off', 'went down'],
                correctAnswer: 'went out',
                explanation: 'Ateşin sönmesi: go out.',
                difficulty: 'intermediate'
            }
        ]

    }
];
