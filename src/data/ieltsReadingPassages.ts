import { ReadingPassage } from '../types';

// IELTS Academic-style passages with the exam's task types. Pitched at roughly
// band 5.5–6.5: shorter than a real exam passage (~650 words instead of ~850),
// with clear paraphrases, so a band 4.5–5 student can build up to the real thing.
// Every `evidence` string must appear word for word in its passage (see tests/reading-content.test.mjs).

const paragraphLetters = (count: number) =>
  Array.from({ length: count }, (_, i) => {
    const letter = String.fromCharCode(65 + i);
    return { letter, text: `Paragraph ${letter}` };
  });

const TFNG_INSTRUCTIONS =
  'Do the following statements agree with the information given in the passage? Choose TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, or NOT GIVEN if there is no information on this.';

const TFNG_TIP =
  'TRUE: metin aynı bilgiyi başka kelimelerle veriyor. FALSE: metin bunun tersini söylüyor. NOT GIVEN: metin bu konuda hiçbir şey söylemiyor. Kendi genel bilginizi kullanmayın, sadece metne bakın. Bu sorular metindeki sırayı takip eder.';

export const ieltsReadingPassages: ReadingPassage[] = [
  {
    id: 'ielts_1',
    title: 'From Glass Jar to Tin Can',
    topic: 'History & Technology',
    difficulty: 'Intermediate',
    format: 'ielts',
    labelParagraphs: true,
    wordCount: 629,
    estimatedTime: 20,
    passage: `Today, canned food is so ordinary that most people never think about it. A tin of beans or tomatoes can sit in a kitchen cupboard for months, and nobody wonders how it stays safe to eat. Yet for most of human history, keeping food for a long time was a serious problem. People dried, salted or smoked meat and fish, but these methods changed the taste of the food and did not work for everything. Soldiers and sailors suffered most, because they often spent months far away from any fresh food.

At the end of the eighteenth century, the French government decided to look for a solution. It offered a prize of 12,000 francs to anyone who could find a better way to keep food fresh for its army. A Paris confectioner, or sweet-maker, called Nicolas Appert took up the challenge and spent more than ten years experimenting. His method was simple: he put food into thick glass bottles, closed them tightly with cork and wax, and then heated the bottles in boiling water. Food prepared in this way stayed fresh for months. In 1810, Appert finally received the prize, but only on one condition: he had to make his method public. In the same year, he published a book that explained every step in detail.

Interestingly, Appert never knew why his method worked. He believed that air was the cause of the problem, so he tried to keep it out of his bottles. The real reason was not discovered until about fifty years later. In the 1860s, the French scientist Louis Pasteur showed that food goes bad because of tiny living organisms called microbes. Heat kills these microbes, and a tightly sealed container stops new ones from getting in. In other words, Appert had found the right answer without understanding the science behind it.

Glass bottles had one big disadvantage: they broke easily, especially when they were carried by soldiers or packed on ships. In Britain, a merchant called Peter Durand took out a patent in 1810 – a legal document that protected his idea – for keeping food in containers made of tin-coated iron as well as glass. Durand did not make any cans himself. Instead, he sold his patent to two businessmen, Bryan Donkin and John Hall, who opened a canning factory in London around 1813. Their cans were soon being supplied to the British Royal Navy, and they were also taken on long journeys of exploration to the Arctic.

Early cans were very different from the ones we buy today. They were made by hand, and a skilled worker could produce only about sixty cans a day. They were also thick and heavy; some early cans actually weighed more than the food inside them. Strangely, for many years nobody invented a special tool to open them. The instructions on one early can told people to 'cut round on the top near to the outer edge with a chisel and hammer', and soldiers often used knives, bayonets or even rocks. The first can openers did not appear until the 1850s, more than forty years after the can itself, and the familiar design with a turning wheel was only developed in 1870.

During the nineteenth and twentieth centuries, machines replaced hand work, and cans became lighter, cheaper and much easier to open. Canned food helped to feed armies in wartime, and it allowed families in cities to eat fruit, vegetables and fish from distant places at any time of year. Today, billions of cans are produced around the world every year. Although many people now prefer fresh or frozen food, the basic idea behind every can – heat the food and seal it from the air – is still the one that Nicolas Appert discovered more than two hundred years ago.`,
    questionGroups: [
      {
        id: 'headings',
        instructions:
          'The passage has six paragraphs, A–F. Choose the correct heading for paragraphs B–F from the list of headings below. There are more headings than paragraphs, so you will not use them all.',
        tip: 'Önce paragrafın ilk ve son cümlelerini okuyup ana fikrini bulun. Sadece aynı kelimeyi gördüğünüz için başlık seçmeyin: çeldirici başlıklar genelde metindeki kelimeleri kullanır ama paragrafın asıl konusunu anlatmaz.',
        optionsTitle: 'List of Headings',
        example: { prompt: 'Paragraph A', answer: 'iii' },
        options: [
          { letter: 'i', text: 'A scientist who disagreed with Appert' },
          { letter: 'ii', text: 'A reward for solving a problem' },
          { letter: 'iii', text: 'An old problem with no good solution' },
          { letter: 'iv', text: 'Slow to make and hard to open' },
          { letter: 'v', text: 'The science is explained at last' },
          { letter: 'vi', text: 'A stronger container and a new business' },
          { letter: 'vii', text: 'The health risks of early canned food' },
          { letter: 'viii', text: 'A simple idea that is still used today' }
        ]
      },
      {
        id: 'tfng',
        instructions: TFNG_INSTRUCTIONS,
        tip: TFNG_TIP
      },
      {
        id: 'sentences',
        instructions:
          'Complete the sentences below. Choose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer.',
        tip: 'Kelimeleri metinden aynen alın ve yazımına dikkat edin. Kelime sınırını aşan cevap, doğru kelimeleri içerse bile yanlış sayılır. Yazdığınız kelimenin cümleye dilbilgisi olarak da uyduğunu kontrol edin.',
        maxWords: 2,
        allowNumber: true
      }
    ],
    questions: [
      {
        id: 1,
        groupId: 'headings',
        questionText: 'Paragraph B',
        questionType: 'matching_headings',
        options: [],
        correctAnswer: 'ii',
        evidence: 'It offered a prize of 12,000 francs to anyone who could find a better way to keep food fresh for its army.',
        explanation: 'Paragraph B is about the French government\'s prize and how Appert won it. "Prize" = "reward", and finding a better way to keep food fresh = "solving a problem".'
      },
      {
        id: 2,
        groupId: 'headings',
        questionText: 'Paragraph C',
        questionType: 'matching_headings',
        options: [],
        correctAnswer: 'v',
        evidence: 'The real reason was not discovered until about fifty years later.',
        explanation: 'Paragraph C explains that Pasteur discovered why Appert\'s method worked, about fifty years later. Heading i is a trap: Pasteur does not disagree with Appert, he explains his success.'
      },
      {
        id: 3,
        groupId: 'headings',
        questionText: 'Paragraph D',
        questionType: 'matching_headings',
        options: [],
        correctAnswer: 'vi',
        evidence: 'for keeping food in containers made of tin-coated iron as well as glass',
        explanation: 'Paragraph D describes metal containers that did not break like glass (a stronger container) and the factory opened by Donkin and Hall (a new business).'
      },
      {
        id: 4,
        groupId: 'headings',
        questionText: 'Paragraph E',
        questionType: 'matching_headings',
        options: [],
        correctAnswer: 'iv',
        evidence: 'a skilled worker could produce only about sixty cans a day',
        explanation: 'Paragraph E says early cans were made slowly by hand (only about sixty a day) and that people had no proper tool to open them. Heading vii is a trap: the paragraph never mentions health.'
      },
      {
        id: 5,
        groupId: 'headings',
        questionText: 'Paragraph F',
        questionType: 'matching_headings',
        options: [],
        correctAnswer: 'viii',
        evidence: 'is still the one that Nicolas Appert discovered more than two hundred years ago',
        explanation: 'The last sentence of paragraph F says the basic idea behind every can is still Appert\'s idea from more than two hundred years ago.'
      },
      {
        id: 6,
        groupId: 'tfng',
        questionText: 'The French government wanted a better way of preserving food for its soldiers.',
        questionType: 'true_false_not_given',
        answerFormat: 'tfng',
        options: [],
        correctAnswer: 'TRUE',
        evidence: 'to anyone who could find a better way to keep food fresh for its army',
        explanation: 'TRUE. Paragraph B says the prize was for "a better way to keep food fresh for its army". "Keep food fresh" = "preserving food", and "army" = "soldiers".'
      },
      {
        id: 7,
        groupId: 'tfng',
        questionText: 'Appert was allowed to keep the details of his method secret.',
        questionType: 'true_false_not_given',
        answerFormat: 'tfng',
        options: [],
        correctAnswer: 'FALSE',
        evidence: 'he had to make his method public',
        explanation: 'FALSE. Appert received the prize only on condition that "he had to make his method public". Public is the opposite of secret, so the passage contradicts the statement.'
      },
      {
        id: 8,
        groupId: 'tfng',
        questionText: 'Pasteur read Appert\'s book before he started his own research.',
        questionType: 'true_false_not_given',
        answerFormat: 'tfng',
        options: [],
        correctAnswer: 'NOT GIVEN',
        evidence: 'the French scientist Louis Pasteur showed that food goes bad because of tiny living organisms called microbes',
        explanation: 'NOT GIVEN. The passage mentions Appert\'s book (paragraph B) and Pasteur\'s discovery (paragraph C), but it never says whether Pasteur read the book. Both names appear, but this connection is not there.'
      },
      {
        id: 9,
        groupId: 'tfng',
        questionText: 'Peter Durand produced the first cans in Britain himself.',
        questionType: 'true_false_not_given',
        answerFormat: 'tfng',
        options: [],
        correctAnswer: 'FALSE',
        evidence: 'Durand did not make any cans himself.',
        explanation: 'FALSE. Paragraph D says "Durand did not make any cans himself". He sold his patent to Donkin and Hall, who opened the factory.'
      },
      {
        id: 10,
        groupId: 'tfng',
        questionText: 'Donkin and Hall\'s factory employed more than a hundred workers.',
        questionType: 'true_false_not_given',
        answerFormat: 'tfng',
        options: [],
        correctAnswer: 'NOT GIVEN',
        evidence: 'who opened a canning factory in London around 1813',
        explanation: 'NOT GIVEN. The passage says when and where the factory opened, but not how many people worked there. Paragraph E mentions what one worker could produce, but that is not information about the size of this factory.'
      },
      {
        id: 11,
        groupId: 'sentences',
        questionText: 'Before canning, meat and fish were often dried, salted or ________.',
        questionType: 'sentence_completion',
        answerFormat: 'text',
        options: [],
        correctAnswer: 'smoked',
        evidence: 'People dried, salted or smoked meat and fish',
        explanation: 'Paragraph A: "People dried, salted or smoked meat and fish". The sentence needs a past participle like "dried" and "salted", so the answer is "smoked".'
      },
      {
        id: 12,
        groupId: 'sentences',
        questionText: 'Appert closed his bottles tightly with cork and ________ before heating them.',
        questionType: 'sentence_completion',
        answerFormat: 'text',
        options: [],
        correctAnswer: 'wax',
        evidence: 'closed them tightly with cork and wax',
        explanation: 'Paragraph B: he "closed them tightly with cork and wax, and then heated the bottles in boiling water".'
      },
      {
        id: 13,
        groupId: 'sentences',
        questionText: 'Pasteur showed that food goes bad because of ________.',
        questionType: 'sentence_completion',
        answerFormat: 'text',
        options: [],
        correctAnswer: 'microbes',
        acceptedAnswers: ['living organisms'],
        evidence: 'tiny living organisms called microbes',
        explanation: 'Paragraph C: "food goes bad because of tiny living organisms called microbes". "Microbes" fits the limit. "Tiny living organisms" is three words, so it would be marked wrong.'
      },
      {
        id: 14,
        groupId: 'sentences',
        questionText: 'At first, one skilled worker could make only about ________ cans a day.',
        questionType: 'sentence_completion',
        answerFormat: 'text',
        options: [],
        correctAnswer: 'sixty',
        acceptedAnswers: ['60'],
        evidence: 'a skilled worker could produce only about sixty cans a day',
        explanation: 'Paragraph E: "a skilled worker could produce only about sixty cans a day". Both "sixty" and "60" are accepted.'
      }
    ],
    createdAt: new Date('2026-10-17')
  },
  {
    id: 'ielts_2',
    title: 'The Surprising Mind of the Octopus',
    topic: 'Science & Nature',
    difficulty: 'Upper Intermediate',
    format: 'ielts',
    labelParagraphs: true,
    wordCount: 671,
    estimatedTime: 20,
    passage: `For a long time, scientists believed that intelligence belonged mainly to animals with backbones, such as apes, dolphins and crows. The octopus, a soft-bodied sea creature related to snails and clams, did not seem a likely candidate. However, research over the last few decades has shown that octopuses can solve problems, learn quickly and even recognise individual people. Some scientists now describe the octopus as the closest thing on Earth to an intelligent alien.

Part of the reason for this surprise is the octopus's unusual body. An octopus has around 500 million nerve cells, which is similar to the number in a dog. However, only about a third of these cells are in its brain. The rest are spread through its eight arms, so each arm can touch, taste and even make simple decisions without help from the brain. In addition, an octopus has three hearts and blue blood, and its body contains no bones at all. As a result, it can squeeze through almost any gap that is larger than its beak, the only hard part of its body.

These soft bodies help to make octopuses famous escape artists. In 2016, an octopus called Inky escaped from his tank at the National Aquarium of New Zealand. Staff believe that he climbed out through a small gap at the top of the tank one night, moved across the floor and slid down a narrow pipe that led to the sea. Aquarium workers in other countries tell similar stories of octopuses that lift the lids of their tanks, visit a nearby tank to eat the fish, and then return home before morning.

Scientists have also studied how octopuses use objects. In 2009, the Australian biologist Julian Finn reported that veined octopuses in Indonesia collect empty coconut shells from the sea floor. The octopuses carry the shells with them, sometimes walking awkwardly on the tips of their arms, and later put two halves together to make a shelter. Finn argued that this is real tool use, because the animal carries the shells for later use rather than for an immediate benefit. Until then, tool use had been seen mainly in mammals and birds.

Other research suggests that octopuses can tell people apart. In a study at the Seattle Aquarium in the United States, Roland Anderson and his colleagues asked two members of staff to wear identical blue uniforms. One person always fed a group of giant Pacific octopuses, while the other always touched them with a rough brush, which the animals disliked. After about a week, the octopuses behaved very differently towards the two people. Most moved towards the person who fed them, but they often moved away from the other person, and some even shot jets of water at them.

The psychologist Jennifer Mather, who works at a university in Canada, has spent many years watching octopuses closely. She found that individual animals have their own personalities: some are shy and hide when people come near, while others are bold and curious. Mather has also described behaviour that looks like play. In one study, some octopuses repeatedly used jets of water to push an empty plastic bottle across their tank and then waited for it to float back, rather like a child bouncing a ball.

Perhaps the most puzzling fact about octopuses is how short their lives are. Most species live for only one or two years, and they usually die soon after they produce young. They also spend most of their lives alone, so young octopuses never learn from their parents. This is unusual, because intelligence usually develops in animals that live for a long time and live in groups, where they can learn from one another. Some researchers think the octopus became intelligent for a different reason: millions of years ago, its ancestors lost their protective shell, so it needed to be clever to find food and avoid predators. Whatever the explanation, the octopus has forced scientists to think again about what intelligence is and where it can be found.`,
    questionGroups: [
      {
        id: 'information',
        instructions:
          'The passage has seven paragraphs, A–G. Which paragraph contains the following information? NB You may use any letter more than once.',
        tip: 'Bu sorular metindeki sırayı takip etmez. Paragrafın genel konusunu değil, istenen bilgi türünü arayın: bir örnek mi, bir sebep mi, bir karşılaştırma mı? Önce anahtar kelimelerin eş anlamlılarını düşünün.',
        options: paragraphLetters(7),
        compactOptions: true
      },
      {
        id: 'tfng',
        instructions: TFNG_INSTRUCTIONS,
        tip: TFNG_TIP
      },
      {
        id: 'researchers',
        instructions:
          'Look at the following statements and the list of researchers below. Match each statement with the correct researcher, A, B or C.',
        tip: 'Önce her ismin metinde geçtiği yeri bulun. Sonra o kişinin bulgusunu ifadeyle karşılaştırın: ifade bulguyu metinden farklı kelimelerle anlatır.',
        optionsTitle: 'List of Researchers',
        options: [
          { letter: 'A', text: 'Julian Finn' },
          { letter: 'B', text: 'Roland Anderson' },
          { letter: 'C', text: 'Jennifer Mather' }
        ]
      },
      {
        id: 'summary',
        instructions: 'Complete the summary below. Choose ONE WORD ONLY from the passage for each answer.',
        tip: 'Özet genelde metnin tek bir bölümünü anlatır; önce o bölümü bulun. Boşluktan önceki ve sonraki kelimelere bakarak nasıl bir kelime (isim, sıfat, zarf) gerektiğini tahmin edin. Sadece bir kelime yazın.',
        maxWords: 1,
        summaryTitle: 'An unusual kind of intelligence',
        summary:
          'Most intelligent animals have long lives and live in [[12]], where they can learn from one another. Octopuses are different: most of them live for only one or two years, and they spend most of their time [[13]]. One theory is that octopuses had to become clever after their ancestors lost the [[14]] that once protected them.'
      }
    ],
    questions: [
      {
        id: 1,
        groupId: 'information',
        questionText: 'a description of an octopus leaving the place where it was kept',
        questionType: 'matching_information',
        options: [],
        correctAnswer: 'C',
        evidence: 'an octopus called Inky escaped from his tank at the National Aquarium of New Zealand',
        explanation: 'Paragraph C tells the story of Inky, who escaped from his tank at an aquarium. "Escaped from his tank" = "leaving the place where it was kept".'
      },
      {
        id: 2,
        groupId: 'information',
        questionText: 'a comparison of the number of nerve cells in an octopus and in another animal',
        questionType: 'matching_information',
        options: [],
        correctAnswer: 'B',
        evidence: 'An octopus has around 500 million nerve cells, which is similar to the number in a dog.',
        explanation: 'Paragraph B says an octopus has around 500 million nerve cells, "similar to the number in a dog".'
      },
      {
        id: 3,
        groupId: 'information',
        questionText: 'a reason why young octopuses cannot learn from adults',
        questionType: 'matching_information',
        options: [],
        correctAnswer: 'G',
        evidence: 'They also spend most of their lives alone, so young octopuses never learn from their parents.',
        explanation: 'Paragraph G: octopuses "spend most of their lives alone, so young octopuses never learn from their parents". The word "so" introduces the result, and "alone" is the reason.'
      },
      {
        id: 4,
        groupId: 'information',
        questionText: 'an explanation of why one activity counts as using a tool',
        questionType: 'matching_information',
        options: [],
        correctAnswer: 'D',
        evidence: 'Finn argued that this is real tool use, because the animal carries the shells for later use rather than for an immediate benefit.',
        explanation: 'Paragraph D: Finn says carrying coconut shells is "real tool use, because the animal carries the shells for later use". "Because" gives the explanation.'
      },
      {
        id: 5,
        groupId: 'tfng',
        questionText: 'Scientists have always believed that octopuses are highly intelligent.',
        questionType: 'true_false_not_given',
        answerFormat: 'tfng',
        options: [],
        correctAnswer: 'FALSE',
        evidence: 'did not seem a likely candidate',
        explanation: 'FALSE. Paragraph A says that for a long time scientists linked intelligence with animals with backbones, and the octopus "did not seem a likely candidate". So scientists have not always thought this.'
      },
      {
        id: 6,
        groupId: 'tfng',
        questionText: 'Most of an octopus\'s nerve cells are found outside its brain.',
        questionType: 'true_false_not_given',
        answerFormat: 'tfng',
        options: [],
        correctAnswer: 'TRUE',
        evidence: 'only about a third of these cells are in its brain',
        explanation: 'TRUE. Paragraph B: "only about a third of these cells are in its brain. The rest are spread through its eight arms." If one third is in the brain, two thirds (most) are outside it.'
      },
      {
        id: 7,
        groupId: 'tfng',
        questionText: 'Inky was found and brought back to the aquarium soon after his escape.',
        questionType: 'true_false_not_given',
        answerFormat: 'tfng',
        options: [],
        correctAnswer: 'NOT GIVEN',
        evidence: 'slid down a narrow pipe that led to the sea',
        explanation: 'NOT GIVEN. Paragraph C explains how Inky escaped, but it says nothing about what happened to him afterwards.'
      },
      {
        id: 8,
        groupId: 'tfng',
        questionText: 'The two staff members in the Seattle study wore different clothes.',
        questionType: 'true_false_not_given',
        answerFormat: 'tfng',
        options: [],
        correctAnswer: 'FALSE',
        evidence: 'asked two members of staff to wear identical blue uniforms',
        explanation: 'FALSE. Paragraph E says the two people wore "identical blue uniforms". Identical means exactly the same, which contradicts "different clothes".'
      },
      {
        id: 9,
        groupId: 'researchers',
        questionText: 'Octopuses can react differently to people who look the same.',
        questionType: 'matching_features',
        options: [],
        correctAnswer: 'B',
        evidence: 'After about a week, the octopuses behaved very differently towards the two people.',
        explanation: 'Roland Anderson (paragraph E): the two people wore identical uniforms (they looked the same), but the octopuses "behaved very differently towards the two people".'
      },
      {
        id: 10,
        groupId: 'researchers',
        questionText: 'Octopuses do not all have the same character.',
        questionType: 'matching_features',
        options: [],
        correctAnswer: 'C',
        evidence: 'individual animals have their own personalities',
        explanation: 'Jennifer Mather (paragraph F) found that "individual animals have their own personalities": some are shy, others are bold. "Personality" = "character".'
      },
      {
        id: 11,
        groupId: 'researchers',
        questionText: 'Octopuses keep objects so that they can use them in the future.',
        questionType: 'matching_features',
        options: [],
        correctAnswer: 'A',
        evidence: 'the animal carries the shells for later use',
        explanation: 'Julian Finn (paragraph D) reported that veined octopuses carry coconut shells "for later use". "Later" = "in the future".'
      },
      {
        id: 12,
        groupId: 'summary',
        questionText: 'Most intelligent animals have long lives and live in ________.',
        questionType: 'summary_completion',
        answerFormat: 'text',
        options: [],
        correctAnswer: 'groups',
        evidence: 'live for a long time and live in groups',
        explanation: 'Paragraph G: intelligence usually develops in animals that "live for a long time and live in groups". After "live in" we need a plural noun: "groups".'
      },
      {
        id: 13,
        groupId: 'summary',
        questionText: 'Octopuses spend most of their time ________.',
        questionType: 'summary_completion',
        answerFormat: 'text',
        options: [],
        correctAnswer: 'alone',
        evidence: 'They also spend most of their lives alone',
        explanation: 'Paragraph G: "They also spend most of their lives alone". "Most of their lives" in the passage = "most of their time" in the summary.'
      },
      {
        id: 14,
        groupId: 'summary',
        questionText: 'Their ancestors lost the ________ that once protected them.',
        questionType: 'summary_completion',
        answerFormat: 'text',
        options: [],
        correctAnswer: 'shell',
        evidence: 'its ancestors lost their protective shell',
        explanation: 'Paragraph G: "its ancestors lost their protective shell". The summary says "the ________ that once protected them", so the noun is "shell" ("protective" has become "that once protected them").'
      }
    ],
    createdAt: new Date('2026-10-17')
  }
];
