import { ReadingPassage } from '../types';

export const sampleReadingPassages: ReadingPassage[] = [
  {
    id: 'passage_1',
    title: 'The History of Coffee',
    topic: 'History & Culture',
    difficulty: 'Intermediate',
    wordCount: 233,
    estimatedTime: 7,
    passage: `Coffee is one of the most popular drinks in the world, but many people do not know its history. The story of coffee begins in Ethiopia. A legend says that a goat herder named Kaldi discovered coffee around 850 AD. He saw that his goats became very active after eating berries from a certain tree.

The knowledge of coffee later spread to the Arabian Peninsula, where people first grew and sold coffee. By the 15th century, coffee was being grown in Yemen. Coffee houses also began to appear in the Middle East. These places became important social centers. People met there to talk about politics, business, and culture.

Coffee arrived in Europe in the 17th century and quickly became popular. At first, some religious groups did not trust it and called it a dangerous drink. However, Pope Clement VIII tasted coffee and liked it. After that, many people accepted coffee more easily.

Today, the coffee industry is very large. People drink more than 2.25 billion cups of coffee every day around the world. Brazil is the largest producer, followed by Vietnam and Colombia. Growing coffee gives jobs to millions of people and brings money to many countries.

Coffee contains caffeine, a natural stimulant that can make people feel more awake. Moderate coffee drinking may improve attention and may have some health benefits. However, too much coffee can cause sleep problems and anxiety.`,
    questions: [
      {
        id: 1,
        questionText: 'What is the main idea of this passage?',
        questionType: 'main_idea',
        options: [
          { letter: 'A', text: 'Coffee is bad for your health' },
          { letter: 'B', text: 'The history and global significance of coffee' },
          { letter: 'C', text: 'How to grow coffee beans' },
          { letter: 'D', text: 'Coffee houses in the Middle East' }
        ],
        correctAnswer: 'B',
        explanation: 'The passage covers the historical origins of coffee, its spread across the world, and its current global importance.'
      },
      {
        id: 2,
        questionText: 'According to the passage, where did coffee originate?',
        questionType: 'detail',
        options: [
          { letter: 'A', text: 'Yemen' },
          { letter: 'B', text: 'Brazil' },
          { letter: 'C', text: 'Ethiopia' },
          { letter: 'D', text: 'Europe' }
        ],
        correctAnswer: 'C',
        explanation: 'The passage states that the story of coffee begins in Ethiopia.'
      },
      {
        id: 3,
        questionText: 'What was one important role of coffee houses in the Middle East?',
        questionType: 'detail',
        options: [
          { letter: 'A', text: 'They only served coffee' },
          { letter: 'B', text: 'They were places where people met and shared ideas' },
          { letter: 'C', text: 'They were unpopular with the public' },
          { letter: 'D', text: 'They were mainly for religious purposes' }
        ],
        correctAnswer: 'B',
        explanation: 'The passage says coffee houses were social centers where people talked about politics, business, and culture.'
      },
      {
        id: 4,
        questionText: 'The word "stimulant" in paragraph 5 most likely means:',
        questionType: 'vocabulary',
        options: [
          { letter: 'A', text: 'something that makes a person feel more awake' },
          { letter: 'B', text: 'something that makes food taste sweet' },
          { letter: 'C', text: 'something that grows only in Brazil' },
          { letter: 'D', text: 'something that removes anxiety completely' }
        ],
        correctAnswer: 'A',
        explanation: 'The passage explains that caffeine is a stimulant that can make people feel more awake.'
      },
      {
        id: 5,
        questionText: 'Which country is currently the largest coffee producer?',
        questionType: 'detail',
        options: [
          { letter: 'A', text: 'Vietnam' },
          { letter: 'B', text: 'Colombia' },
          { letter: 'C', text: 'Ethiopia' },
          { letter: 'D', text: 'Brazil' }
        ],
        correctAnswer: 'D',
        explanation: 'The passage clearly states that Brazil is the largest producer.'
      }
    ],
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'passage_2',
    title: 'Climate Change and Ocean Ecosystems',
    topic: 'Science & Environment',
    difficulty: 'Intermediate',
    wordCount: 242,
    estimatedTime: 9,
    passage: `The world's oceans are changing because of global warming. These changes affect sea animals, plants, and the people who depend on the ocean. Warmer sea water can cause coral bleaching. During bleaching, corals lose the tiny algae that give them color and food. Without these algae, corals turn white and may die. This is serious because coral reefs support about 25% of all marine species.

Another problem is ocean acidification. The ocean absorbs carbon dioxide from the air. When this happens, the water becomes more acidic. This makes life harder for shellfish, sea urchins, and other animals that need strong shells or skeletons. Scientists say ocean acidity has increased by about 30% since the Industrial Revolution.

Warmer water also causes many marine species to move toward cooler areas near the poles. This movement can change fishing areas and make life difficult for coastal communities. Some animals cannot move fast enough or cannot find a good new home, so they may become endangered.

Melting polar ice also raises sea levels. Higher sea levels threaten coastal ecosystems such as mangroves and salt marshes. These places are important because young fish grow there, and they can also protect coasts from storms and floods.

Solving these problems requires action from many countries. People need to reduce greenhouse gas emissions. Marine protected areas, careful fishing, and habitat restoration can also help ocean ecosystems become stronger. Without lower carbon emissions, the future of ocean life will remain worrying.`,
    questions: [
      {
        id: 1,
        questionText: 'What is the author\'s primary purpose in writing this passage?',
        questionType: 'purpose',
        options: [
          { letter: 'A', text: 'To celebrate the beauty of ocean ecosystems' },
          { letter: 'B', text: 'To explain the effects of climate change on oceans' },
          { letter: 'C', text: 'To criticize government environmental policies' },
          { letter: 'D', text: 'To promote tourism to coral reefs' }
        ],
        correctAnswer: 'B',
        explanation: 'The passage explains several effects of climate change on oceans, including coral bleaching, acidification, species movement, and rising sea levels.'
      },
      {
        id: 2,
        questionText: 'According to the passage, what percentage of marine species rely on coral reef habitats?',
        questionType: 'detail',
        options: [
          { letter: 'A', text: '15%' },
          { letter: 'B', text: '25%' },
          { letter: 'C', text: '30%' },
          { letter: 'D', text: '50%' }
        ],
        correctAnswer: 'B',
        explanation: 'The passage states that coral reefs support about 25% of all marine species.'
      },
      {
        id: 3,
        questionText: 'The word "marine" in paragraph 1 most likely means:',
        questionType: 'vocabulary',
        options: [
          { letter: 'A', text: 'related to the sea' },
          { letter: 'B', text: 'related to forests' },
          { letter: 'C', text: 'related to farming' },
          { letter: 'D', text: 'related to cities' }
        ],
        correctAnswer: 'A',
        explanation: '"Marine" means related to the sea. The passage uses it to describe ocean species.'
      },
      {
        id: 4,
        questionText: 'According to the passage, how much has ocean acidity increased since the Industrial Revolution?',
        questionType: 'detail',
        options: [
          { letter: 'A', text: 'About 10%' },
          { letter: 'B', text: 'About 25%' },
          { letter: 'C', text: 'About 30%' },
          { letter: 'D', text: 'About 50%' }
        ],
        correctAnswer: 'C',
        explanation: 'The passage states that ocean acidity has increased by about 30% since the Industrial Revolution.'
      },
      {
        id: 5,
        questionText: 'Why are mangroves and salt marshes mentioned in the passage?',
        questionType: 'structure',
        options: [
          { letter: 'A', text: 'To show examples of ecosystems threatened by rising sea levels' },
          { letter: 'B', text: 'To compare them with coral reefs' },
          { letter: 'C', text: 'To explain how fish migrate' },
          { letter: 'D', text: 'To describe their beauty' }
        ],
        correctAnswer: 'A',
        explanation: 'Mangroves and salt marshes are mentioned as coastal ecosystems threatened by higher sea levels.'
      },
      {
        id: 6,
        questionText: 'What is the author\'s feeling in the final paragraph?',
        questionType: 'tone',
        options: [
          { letter: 'A', text: 'Optimistic and cheerful' },
          { letter: 'B', text: 'Neutral and indifferent' },
          { letter: 'C', text: 'Urgent, but still suggesting possible solutions' },
          { letter: 'D', text: 'Angry and accusatory' }
        ],
        correctAnswer: 'C',
        explanation: 'The final paragraph says action is needed and gives possible solutions, but it also warns that the future will remain worrying without lower emissions.'
      }
    ],
    createdAt: new Date('2024-01-20')
  },
  {
    id: 'passage_3',
    title: 'The Rise of Remote Work',
    topic: 'Business & Society',
    difficulty: 'Intermediate',
    wordCount: 217,
    estimatedTime: 7,
    passage: `The COVID-19 pandemic made remote work grow much faster. Before 2020, only about 5% of employees worked from home regularly. By 2022, that number had risen to over 25% in many developed countries. This change made people think differently about work and office culture.

For employees, remote work has several advantages. Not traveling to an office every day saves time and reduces stress. Many workers say they are more productive at home because there are fewer office distractions. Remote work can also make it easier to manage personal responsibilities and work tasks.

However, remote work also has challenges. Some employees feel lonely and miss the social side of office life. The line between work and home life can become blurred, so some people work longer hours. Younger employees may also miss chances to learn from older or more experienced colleagues.

Companies have had to change the way they manage teams. They use online meeting tools, new ways to measure work, and different methods to keep company culture strong when people are not in the same building.

In the future, most experts think a hybrid model will become common. In this model, employees work from home on some days and come to the office on other days. This gives workers some benefits of both remote and office work.`,
    questions: [
      {
        id: 1,
        questionText: 'What is the main topic of this passage?',
        questionType: 'main_idea',
        options: [
          { letter: 'A', text: 'The negative effects of COVID-19' },
          { letter: 'B', text: 'How companies can improve productivity' },
          { letter: 'C', text: 'The growth, benefits, and challenges of remote work' },
          { letter: 'D', text: 'Why office work is better than remote work' }
        ],
        correctAnswer: 'C',
        explanation: 'The passage discusses the rise of remote work, its benefits, its challenges, and a possible future hybrid model.'
      },
      {
        id: 2,
        questionText: 'According to the passage, what percentage of employees worked from home before 2020?',
        questionType: 'detail',
        options: [
          { letter: 'A', text: 'About 5%' },
          { letter: 'B', text: 'About 15%' },
          { letter: 'C', text: 'About 25%' },
          { letter: 'D', text: 'About 50%' }
        ],
        correctAnswer: 'A',
        explanation: 'The passage clearly states that before 2020, only about 5% of employees worked from home regularly.'
      },
      {
        id: 3,
        questionText: 'The word "blurred" in paragraph 3 is closest in meaning to:',
        questionType: 'vocabulary',
        options: [
          { letter: 'A', text: 'strengthened' },
          { letter: 'B', text: 'unclear or indistinct' },
          { letter: 'C', text: 'completely removed' },
          { letter: 'D', text: 'carefully defined' }
        ],
        correctAnswer: 'B',
        explanation: '"Blurred" means unclear. In context, it describes how the separation between work and personal life becomes less clear when working from home.'
      },
      {
        id: 4,
        questionText: 'What problem may younger employees have with remote work?',
        questionType: 'detail',
        options: [
          { letter: 'A', text: 'They prefer remote work to office work' },
          { letter: 'B', text: 'They may lose valuable learning opportunities' },
          { letter: 'C', text: 'They are more productive at home' },
          { letter: 'D', text: 'They do not need mentoring' }
        ],
        correctAnswer: 'B',
        explanation: 'The passage says younger employees may miss chances to learn from older or more experienced colleagues.'
      },
      {
        id: 5,
        questionText: 'What future work arrangement do experts predict will become standard?',
        questionType: 'detail',
        options: [
          { letter: 'A', text: 'Full-time remote work' },
          { letter: 'B', text: 'Full-time office work' },
          { letter: 'C', text: 'A hybrid model' },
          { letter: 'D', text: 'Shortened work weeks' }
        ],
        correctAnswer: 'C',
        explanation: 'The passage states that most experts think a hybrid model will become common.'
      }
    ],
    createdAt: new Date('2024-02-01')
  },
  {
    id: 'passage_4',
    title: 'The Psychology of Color',
    topic: 'Psychology & Art',
    difficulty: 'Pre-Intermediate',
    wordCount: 212,
    estimatedTime: 5,
    passage: `Colors can have a strong effect on our emotions and behavior. This idea is called color psychology. Scientists, marketers, designers, and artists have studied and used it for many years.

Red is often connected with energy, passion, and excitement. It can increase heart rate and make people feel hungry. This is why many restaurants use red in their decor. However, red can also suggest danger or anger.

Blue usually has a calming effect. It is often used in bedrooms and offices because it can reduce stress and help people focus. Many technology companies use blue in their logos because it can look trustworthy and reliable.

Yellow is the color of sunshine and happiness. It can make people feel cheerful and optimistic. However, too much yellow can make some people feel anxious or tired.

Green represents nature, growth, and harmony. It is easy on the eyes and can create a feeling of balance. This is why green is common in hospitals and schools.

Different cultures may understand colors differently. For example, white represents purity in many Western cultures, but it is connected with mourning in some Asian countries.

Understanding color psychology can help us make better choices in daily life, from the clothes we wear to the colors we choose for our rooms.`,
    questions: [
      {
        id: 1,
        questionText: 'What is the main purpose of this passage?',
        questionType: 'purpose',
        options: [
          { letter: 'A', text: 'To teach readers how to paint' },
          { letter: 'B', text: 'To explain how colors affect people' },
          { letter: 'C', text: 'To sell colorful products' },
          { letter: 'D', text: 'To compare Western and Asian cultures' }
        ],
        correctAnswer: 'B',
        explanation: 'The passage explains the psychological effects of different colors on human emotions and behavior.'
      },
      {
        id: 2,
        questionText: 'Why do many restaurants use red in their decor?',
        questionType: 'detail',
        options: [
          { letter: 'A', text: 'Because red is the cheapest color' },
          { letter: 'B', text: 'Because red can stimulate appetite' },
          { letter: 'C', text: 'Because red makes food look better' },
          { letter: 'D', text: 'Because red is the most popular color' }
        ],
        correctAnswer: 'B',
        explanation: 'The passage states that red can make people feel hungry, which is why many restaurants use red in their decor.'
      },
      {
        id: 3,
        questionText: 'According to the passage, which color is best for reducing stress?',
        questionType: 'detail',
        options: [
          { letter: 'A', text: 'Red' },
          { letter: 'B', text: 'Yellow' },
          { letter: 'C', text: 'Blue' },
          { letter: 'D', text: 'Green' }
        ],
        correctAnswer: 'C',
        explanation: 'The passage states that blue usually has a calming effect and can reduce stress.'
      },
      {
        id: 4,
        questionText: 'According to the passage, what is true about the color white?',
        questionType: 'detail',
        options: [
          { letter: 'A', text: 'It has the same meaning everywhere' },
          { letter: 'B', text: 'Its meaning varies across cultures' },
          { letter: 'C', text: 'It is universally disliked' },
          { letter: 'D', text: 'It has no psychological effect' }
        ],
        correctAnswer: 'B',
        explanation: 'The passage says white represents purity in many Western cultures but is connected with mourning in some Asian countries.'
      }
    ],
    createdAt: new Date('2024-02-10')
  },
  {
    id: 'passage_5',
    title: 'The Future of Artificial Intelligence',
    topic: 'Technology',
    difficulty: 'Upper Intermediate',
    wordCount: 287,
    estimatedTime: 10,
    passage: `Artificial intelligence, or AI, has moved from an idea in science to a normal part of modern life. Machine learning systems now help with many everyday tasks. They recommend films on streaming platforms, organize online searches, and support doctors with medical information. As AI becomes more powerful, people are asking important questions about how it should be used.

One common question is how AI will affect jobs. In the past, new technology removed some jobs but also created new ones. Some economists believe AI may be different because it can do both physical and mental work. AI systems can now help with legal research, financial analysis, writing, and image creation. This means many types of workers may need to learn new skills.

Supporters of AI focus on its possible benefits. AI can study very large amounts of data and find patterns that humans may miss. This can help with climate research, new medicine, and better use of resources. In healthcare, some AI systems can help doctors find certain cancers earlier, which may save lives.

However, critics are worried about bias in AI systems. If an AI system learns from unfair or incomplete data, it may make unfair decisions. This can affect loan approvals, job applications, and even criminal justice. Some people are also concerned that only a few large technology companies control much of AI development.

Another question is whether artificial general intelligence, or AGI, will ever exist. AGI means AI that can think and learn across many areas like a human. Some researchers believe it may happen in the future, while others think it may never happen. For now, many experts agree that society needs clear rules so AI develops in a fair and useful way.`,
    questions: [
      {
        id: 1,
        questionText: 'How does the author discuss AI in this passage?',
        questionType: 'tone',
        options: [
          { letter: 'A', text: 'Entirely optimistic about AI\'s benefits' },
          { letter: 'B', text: 'Completely opposed to AI development' },
          { letter: 'C', text: 'Balanced, presenting both benefits and concerns' },
          { letter: 'D', text: 'Indifferent to the topic' }
        ],
        correctAnswer: 'C',
        explanation: 'The author explains both possible benefits of AI and concerns about AI, so the approach is balanced.'
      },
      {
        id: 2,
        questionText: 'According to the passage, why may AI be different from earlier technology?',
        questionType: 'detail',
        options: [
          { letter: 'A', text: 'It only affects physical work' },
          { letter: 'B', text: 'It creates more jobs than it removes' },
          { letter: 'C', text: 'It can affect both physical and mental work' },
          { letter: 'D', text: 'It is developing more slowly' }
        ],
        correctAnswer: 'C',
        explanation: 'The passage says AI can do both physical and mental work, so many types of workers may be affected.'
      },
      {
        id: 3,
        questionText: 'The word "bias" in paragraph 4 most likely means:',
        questionType: 'vocabulary',
        options: [
          { letter: 'A', text: 'unfair preference or treatment' },
          { letter: 'B', text: 'a useful medical tool' },
          { letter: 'C', text: 'a type of computer screen' },
          { letter: 'D', text: 'a faster internet connection' }
        ],
        correctAnswer: 'A',
        explanation: 'In the passage, bias means unfairness in AI systems that can lead to unfair decisions.'
      },
      {
        id: 4,
        questionText: 'What does the passage say about artificial general intelligence (AGI)?',
        questionType: 'detail',
        options: [
          { letter: 'A', text: 'It has already been achieved' },
          { letter: 'B', text: 'There is agreement it will arrive soon' },
          { letter: 'C', text: 'Experts disagree about if and when it will happen' },
          { letter: 'D', text: 'It is not a topic of serious research' }
        ],
        correctAnswer: 'C',
        explanation: 'The passage says some researchers believe AGI may happen in the future, while others think it may never happen.'
      },
      {
        id: 5,
        questionText: 'Which of the following is mentioned as a potential benefit of AI in healthcare?',
        questionType: 'detail',
        options: [
          { letter: 'A', text: 'Replacing all doctors' },
          { letter: 'B', text: 'Making healthcare free' },
          { letter: 'C', text: 'Earlier detection of certain cancers' },
          { letter: 'D', text: 'Eliminating all diseases' }
        ],
        correctAnswer: 'C',
        explanation: 'The passage says some AI systems can help doctors find certain cancers earlier.'
      },
      {
        id: 6,
        questionText: 'What concern does the passage raise about AI development?',
        questionType: 'detail',
        options: [
          { letter: 'A', text: 'It makes AI development slower' },
          { letter: 'B', text: 'A few large technology companies control much of it' },
          { letter: 'C', text: 'It improves AI safety' },
          { letter: 'D', text: 'It reduces costs for consumers' }
        ],
        correctAnswer: 'B',
        explanation: 'The passage says some people are concerned that only a few large technology companies control much of AI development.'
      }
    ],
    createdAt: new Date('2024-02-15')
  }
];

export const getReadingPassageById = (id: string): ReadingPassage | undefined => {
  return sampleReadingPassages.find(p => p.id === id);
};

export const getReadingPassagesByDifficulty = (difficulty: string): ReadingPassage[] => {
  return sampleReadingPassages.filter(p => p.difficulty === difficulty);
};

export const getReadingPassagesByTopic = (topic: string): ReadingPassage[] => {
  return sampleReadingPassages.filter(p => p.topic === topic);
};










