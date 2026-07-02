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
  },
  {
    id: 'passage_6',
    title: 'Urban Gardens and Community Life',
    topic: 'Society & Environment',
    difficulty: 'Upper Intermediate',
    wordCount: 236,
    estimatedTime: 10,
    passage: `In many cities, small areas of unused land are being turned into community gardens. These gardens are usually managed by local residents, schools, or neighborhood groups. At first, they may look like simple places to grow vegetables, but their value often goes far beyond food.

One benefit is that community gardens make fresh produce more accessible. In some neighborhoods, supermarkets are far away or too expensive for many families. A shared garden can provide tomatoes, herbs, lettuce, and other basic foods during the growing season. Even when the harvest is small, it can help people feel more connected to what they eat.

Community gardens can also improve social life. People who might not normally speak to one another meet while watering plants, sharing tools, or planning weekend work. Older residents may teach younger people how to plant seeds or protect plants from insects. In this way, the garden becomes a place for informal learning.

There are environmental benefits as well. Plants can cool small areas of a city, attract bees and butterflies, and absorb rainwater that might otherwise run into streets. Some gardens also use compost, which turns food waste into useful soil.

However, community gardens need careful organization. Someone must decide who can use each plot, how water will be paid for, and what rules everyone should follow. If these questions are handled fairly, a small garden can become an important part of city life.`,
    questions: [
      {
        id: 1,
        questionText: 'What is the main idea of this passage?',
        questionType: 'main_idea',
        options: [
          { letter: 'A', text: 'Community gardens only help people grow food' },
          { letter: 'B', text: 'Community gardens can support food, social life, and the environment' },
          { letter: 'C', text: 'City land should never be used for housing' },
          { letter: 'D', text: 'Gardening is too difficult for most city residents' }
        ],
        correctAnswer: 'B',
        explanation: 'The passage explains several benefits of community gardens, including food, social connection, learning, and environmental value.'
      },
      {
        id: 2,
        questionText: 'According to the passage, why can community gardens help some neighborhoods?',
        questionType: 'detail',
        options: [
          { letter: 'A', text: 'They replace all supermarkets' },
          { letter: 'B', text: 'They provide some fresh produce where shops may be far away or expensive' },
          { letter: 'C', text: 'They make all food free for the city' },
          { letter: 'D', text: 'They stop people from buying vegetables' }
        ],
        correctAnswer: 'B',
        explanation: 'The passage says gardens can help when supermarkets are far away or too expensive by providing some fresh produce.'
      },
      {
        id: 3,
        questionText: 'The word "accessible" in paragraph 2 is closest in meaning to:',
        questionType: 'vocabulary',
        options: [
          { letter: 'A', text: 'easy to reach or use' },
          { letter: 'B', text: 'impossible to grow' },
          { letter: 'C', text: 'expensive to repair' },
          { letter: 'D', text: 'hidden from public view' }
        ],
        correctAnswer: 'A',
        explanation: '"Accessible" means easy to reach or use. In the passage, it refers to fresh produce being easier for people to get.'
      },
      {
        id: 4,
        questionText: 'What can be inferred about older residents in community gardens?',
        questionType: 'inference',
        options: [
          { letter: 'A', text: 'They may share useful gardening knowledge' },
          { letter: 'B', text: 'They are not allowed to use garden plots' },
          { letter: 'C', text: 'They usually avoid speaking to younger people' },
          { letter: 'D', text: 'They only visit gardens in winter' }
        ],
        correctAnswer: 'A',
        explanation: 'The passage says older residents may teach younger people how to plant seeds or protect plants.'
      },
      {
        id: 5,
        questionText: 'Why does the final paragraph mention rules and water costs?',
        questionType: 'structure',
        options: [
          { letter: 'A', text: 'To show that gardens need organization to work well' },
          { letter: 'B', text: 'To prove that gardens are always unsuccessful' },
          { letter: 'C', text: 'To explain why plants need sunlight' },
          { letter: 'D', text: 'To compare gardens with supermarkets' }
        ],
        correctAnswer: 'A',
        explanation: 'The final paragraph explains that community gardens need fair rules and organization.'
      }
    ],
    createdAt: new Date('2024-03-01')
  },
  {
    id: 'passage_7',
    title: 'The Science of Sleep',
    topic: 'Health & Science',
    difficulty: 'Upper Intermediate',
    wordCount: 221,
    estimatedTime: 10,
    passage: `Sleep is often treated as a break from daily life, but scientists describe it as an active process. While we sleep, the brain sorts information, strengthens memories, and helps the body repair itself. For students and workers, sleep is not a luxury; it is part of learning and health.

One important function of sleep is memory. After people learn new information, sleep helps the brain organize it. This does not mean that sleeping once before a test is enough. Regular sleep over many nights is more useful than one long night of rest after several late nights.

Sleep also affects emotions. People who sleep poorly often find it harder to stay calm, solve problems, or respond patiently to others. This is one reason why tired people may overreact to small problems. Good sleep can make daily stress easier to manage.

Modern life creates several obstacles to healthy sleep. Bright screens, late messages, caffeine, and irregular schedules can all delay the body clock. Many people also use their phones in bed, which makes the brain connect the bedroom with activity instead of rest.

Experts usually recommend a simple routine: keep similar sleep and wake times, reduce screen use before bed, and make the room dark and quiet. These habits may sound ordinary, but they can have a strong effect when practiced consistently.`,
    questions: [
      {
        id: 1,
        questionText: 'What is the main purpose of this passage?',
        questionType: 'purpose',
        options: [
          { letter: 'A', text: 'To explain why sleep is important for the brain, body, and emotions' },
          { letter: 'B', text: 'To argue that people should study only at night' },
          { letter: 'C', text: 'To describe the history of sleeping habits' },
          { letter: 'D', text: 'To compare different types of beds' }
        ],
        correctAnswer: 'A',
        explanation: 'The passage explains several roles of sleep, including memory, emotional control, and physical repair.'
      },
      {
        id: 2,
        questionText: 'According to the passage, how does sleep help with learning?',
        questionType: 'detail',
        options: [
          { letter: 'A', text: 'It removes the need to study' },
          { letter: 'B', text: 'It helps the brain organize new information' },
          { letter: 'C', text: 'It makes every subject easy' },
          { letter: 'D', text: 'It works only on the night before a test' }
        ],
        correctAnswer: 'B',
        explanation: 'The passage states that sleep helps the brain organize information after people learn it.'
      },
      {
        id: 3,
        questionText: 'The word "obstacles" in paragraph 4 is closest in meaning to:',
        questionType: 'vocabulary',
        options: [
          { letter: 'A', text: 'things that make something difficult' },
          { letter: 'B', text: 'habits that always help' },
          { letter: 'C', text: 'places for sleeping' },
          { letter: 'D', text: 'types of memory' }
        ],
        correctAnswer: 'A',
        explanation: '"Obstacles" are things that make something difficult. The passage lists problems that can delay healthy sleep.'
      },
      {
        id: 4,
        questionText: 'What can be inferred about using a phone in bed?',
        questionType: 'inference',
        options: [
          { letter: 'A', text: 'It may make it harder for the brain to relax in bed' },
          { letter: 'B', text: 'It always improves sleep quality' },
          { letter: 'C', text: 'It is the only cause of poor sleep' },
          { letter: 'D', text: 'It helps people wake up earlier' }
        ],
        correctAnswer: 'A',
        explanation: 'The passage says phone use in bed can make the brain connect the bedroom with activity instead of rest.'
      },
      {
        id: 5,
        questionText: 'Which habit is recommended in the final paragraph?',
        questionType: 'detail',
        options: [
          { letter: 'A', text: 'Drinking caffeine before bed' },
          { letter: 'B', text: 'Changing sleep times every night' },
          { letter: 'C', text: 'Reducing screen use before bed' },
          { letter: 'D', text: 'Keeping the room bright' }
        ],
        correctAnswer: 'C',
        explanation: 'The final paragraph recommends reducing screen use before bed.'
      }
    ],
    createdAt: new Date('2024-03-05')
  },
  {
    id: 'passage_8',
    title: 'Public Transport and City Life',
    topic: 'Urban Planning',
    difficulty: 'Upper Intermediate',
    wordCount: 236,
    estimatedTime: 10,
    passage: `Public transport shapes how people experience a city. Buses, trams, metros, and trains do more than move passengers from one place to another. They influence where people can work, how much money they spend on travel, and how much pollution a city produces.

A strong transport system gives people more choices. Someone who does not own a car can still reach schools, hospitals, shops, and offices. This is especially important for young people, older adults, and families with lower incomes. When transport is reliable, people can plan their day with less stress.

Public transport can also reduce traffic. A full bus may carry the same number of people as many private cars. This means fewer vehicles on the road, less noise, and lower emissions. However, people are more likely to use public transport when it is clean, safe, frequent, and connected to the places they need to go.

Design matters as much as vehicles. Clear signs, simple ticket systems, and comfortable waiting areas can make a journey easier. If a passenger must use three confusing apps or wait at a dark stop, the system feels less useful, even if the bus itself is modern.

Cities that invest in public transport often need patience. New routes and stations can be expensive, and construction may disturb daily life for a while. Over time, though, better transport can make a city more equal, cleaner, and easier to move through.`,
    questions: [
      {
        id: 1,
        questionText: 'What is the main idea of this passage?',
        questionType: 'main_idea',
        options: [
          { letter: 'A', text: 'Public transport affects many parts of city life' },
          { letter: 'B', text: 'Private cars are always cheaper than buses' },
          { letter: 'C', text: 'Cities should stop building train stations' },
          { letter: 'D', text: 'Modern buses do not need drivers' }
        ],
        correctAnswer: 'A',
        explanation: 'The passage explains how public transport affects access, traffic, pollution, design, and equality in cities.'
      },
      {
        id: 2,
        questionText: 'According to the passage, who especially benefits from reliable public transport?',
        questionType: 'detail',
        options: [
          { letter: 'A', text: 'Only people who own cars' },
          { letter: 'B', text: 'Young people, older adults, and lower-income families' },
          { letter: 'C', text: 'Only tourists visiting museums' },
          { letter: 'D', text: 'People who never travel' }
        ],
        correctAnswer: 'B',
        explanation: 'The passage directly names young people, older adults, and families with lower incomes.'
      },
      {
        id: 3,
        questionText: 'The word "reliable" in paragraph 2 is closest in meaning to:',
        questionType: 'vocabulary',
        options: [
          { letter: 'A', text: 'expensive and rare' },
          { letter: 'B', text: 'able to be trusted' },
          { letter: 'C', text: 'difficult to understand' },
          { letter: 'D', text: 'far from the city' }
        ],
        correctAnswer: 'B',
        explanation: '"Reliable" means able to be trusted. A reliable system helps people plan their day.'
      },
      {
        id: 4,
        questionText: 'Why does the passage mention clear signs and simple ticket systems?',
        questionType: 'structure',
        options: [
          { letter: 'A', text: 'To show that design can affect how useful transport feels' },
          { letter: 'B', text: 'To explain how buses are built' },
          { letter: 'C', text: 'To argue that signs are more important than routes' },
          { letter: 'D', text: 'To describe traffic laws' }
        ],
        correctAnswer: 'A',
        explanation: 'The passage uses these examples to show that passenger experience depends on design, not only vehicles.'
      },
      {
        id: 5,
        questionText: 'What is the author\'s attitude toward investing in public transport?',
        questionType: 'tone',
        options: [
          { letter: 'A', text: 'Generally supportive, while recognizing costs and disruption' },
          { letter: 'B', text: 'Completely negative' },
          { letter: 'C', text: 'Uninterested and neutral' },
          { letter: 'D', text: 'Only concerned with ticket prices' }
        ],
        correctAnswer: 'A',
        explanation: 'The author says investment can be expensive and disruptive, but also explains long-term benefits.'
      }
    ],
    createdAt: new Date('2024-03-10')
  },
  {
    id: 'passage_9',
    title: 'Digital Payments and Everyday Life',
    topic: 'Technology & Society',
    difficulty: 'Upper Intermediate',
    wordCount: 226,
    estimatedTime: 9,
    passage: `Digital payments have changed the way many people buy and sell things. Instead of using cash, customers can pay with cards, mobile phones, watches, or online banking apps. For many businesses, this makes payments faster and reduces the need to keep large amounts of cash in a shop.

Convenience is the main reason digital payments have grown. A person can order food, pay bills, or send money to a friend without visiting a bank. Small businesses can also sell to customers online and receive payment immediately. This can help them reach people outside their local area.

However, digital payments can create new problems. Not everyone has a bank account, a smartphone, or a stable internet connection. Older adults and people in rural areas may find digital systems difficult to use. If shops stop accepting cash completely, these customers may be excluded.

Security is another concern. Digital systems can record where and when people spend money. This information can help banks notice fraud, but it also raises questions about privacy. Customers need to understand passwords, suspicious links, and the risks of sharing personal information.

For these reasons, many experts support a balanced approach. Digital payments are useful and will probably continue to grow, but cash still has a role. A payment system works best when it is fast, safe, and open to as many people as possible.`,
    questions: [
      {
        id: 1,
        questionText: 'What is the passage mainly about?',
        questionType: 'main_idea',
        options: [
          { letter: 'A', text: 'The benefits and challenges of digital payments' },
          { letter: 'B', text: 'Why cash has disappeared everywhere' },
          { letter: 'C', text: 'How to open a bank account' },
          { letter: 'D', text: 'The history of shopping malls' }
        ],
        correctAnswer: 'A',
        explanation: 'The passage discusses both advantages of digital payments and concerns such as access, security, and privacy.'
      },
      {
        id: 2,
        questionText: 'According to the passage, why are digital payments convenient?',
        questionType: 'detail',
        options: [
          { letter: 'A', text: 'They require people to visit a bank every day' },
          { letter: 'B', text: 'They let people pay bills or send money without visiting a bank' },
          { letter: 'C', text: 'They can only be used in large stores' },
          { letter: 'D', text: 'They remove the need for passwords' }
        ],
        correctAnswer: 'B',
        explanation: 'The passage says people can pay bills or send money to a friend without visiting a bank.'
      },
      {
        id: 3,
        questionText: 'The word "excluded" in paragraph 3 is closest in meaning to:',
        questionType: 'vocabulary',
        options: [
          { letter: 'A', text: 'left out' },
          { letter: 'B', text: 'invited in' },
          { letter: 'C', text: 'paid more quickly' },
          { letter: 'D', text: 'protected from fraud' }
        ],
        correctAnswer: 'A',
        explanation: '"Excluded" means left out. The passage says some customers may be left out if shops stop accepting cash.'
      },
      {
        id: 4,
        questionText: 'What concern does the passage raise about privacy?',
        questionType: 'detail',
        options: [
          { letter: 'A', text: 'Digital systems can record spending information' },
          { letter: 'B', text: 'Cash always records personal details' },
          { letter: 'C', text: 'Passwords are never needed online' },
          { letter: 'D', text: 'Banks cannot notice fraud' }
        ],
        correctAnswer: 'A',
        explanation: 'The passage says digital systems can record where and when people spend money.'
      },
      {
        id: 5,
        questionText: 'What does the author suggest in the final paragraph?',
        questionType: 'inference',
        options: [
          { letter: 'A', text: 'Digital payments are useful, but cash should still be available' },
          { letter: 'B', text: 'All shops should refuse cash immediately' },
          { letter: 'C', text: 'Online payments should be slower' },
          { letter: 'D', text: 'Only banks should sell products online' }
        ],
        correctAnswer: 'A',
        explanation: 'The author supports a balanced approach and says cash still has a role.'
      }
    ],
    createdAt: new Date('2024-03-15')
  },
  {
    id: 'passage_10',
    title: 'Learning a Second Language as an Adult',
    topic: 'Education',
    difficulty: 'Upper Intermediate',
    wordCount: 224,
    estimatedTime: 10,
    passage: `Many adults believe that children learn languages easily while adults learn slowly. There is some truth in this idea, especially with pronunciation. Young children often copy new sounds without fear. Adults may notice mistakes more and feel embarrassed when they speak. However, adults also have strengths that can help them learn effectively.

Adult learners usually understand why they are studying. They may need English for work, travel, university, or communication with friends. This clear purpose can create strong motivation. Adults can also use learning strategies, such as taking notes, comparing grammar with their first language, and setting weekly goals.

Another advantage is life experience. Adults know more about the world, so they can connect new words to real situations. For example, a business owner learning words about negotiation may understand the topic quickly because it connects to daily work.

The main challenge is often time. Adults may have jobs, families, and other responsibilities. Because of this, short regular practice can be more realistic than long study sessions. Reading for ten minutes, reviewing vocabulary on a bus, or speaking with a teacher once a week can still lead to progress.

Successful adult learners usually accept that mistakes are part of the process. They do not wait until their English is perfect before speaking. Instead, they use the language, notice problems, and improve step by step.`,
    questions: [
      {
        id: 1,
        questionText: 'What is the main idea of this passage?',
        questionType: 'main_idea',
        options: [
          { letter: 'A', text: 'Adults cannot learn new languages' },
          { letter: 'B', text: 'Adults face challenges but also have useful strengths when learning languages' },
          { letter: 'C', text: 'Children should not study pronunciation' },
          { letter: 'D', text: 'Language learning is only useful for travel' }
        ],
        correctAnswer: 'B',
        explanation: 'The passage explains both challenges and strengths of adult language learners.'
      },
      {
        id: 2,
        questionText: 'According to the passage, why can adults have strong motivation?',
        questionType: 'detail',
        options: [
          { letter: 'A', text: 'They usually know why they are studying' },
          { letter: 'B', text: 'They never feel embarrassed' },
          { letter: 'C', text: 'They always have more free time than children' },
          { letter: 'D', text: 'They do not need weekly goals' }
        ],
        correctAnswer: 'A',
        explanation: 'The passage says adult learners often have a clear purpose, which can create strong motivation.'
      },
      {
        id: 3,
        questionText: 'The word "strategies" in paragraph 2 is closest in meaning to:',
        questionType: 'vocabulary',
        options: [
          { letter: 'A', text: 'planned methods' },
          { letter: 'B', text: 'random mistakes' },
          { letter: 'C', text: 'native sounds' },
          { letter: 'D', text: 'school buildings' }
        ],
        correctAnswer: 'A',
        explanation: '"Strategies" means planned methods. The passage gives examples such as taking notes and setting goals.'
      },
      {
        id: 4,
        questionText: 'Why does the passage mention a business owner?',
        questionType: 'structure',
        options: [
          { letter: 'A', text: 'To show how life experience can connect to new vocabulary' },
          { letter: 'B', text: 'To explain how to start a company' },
          { letter: 'C', text: 'To prove that only business owners learn English' },
          { letter: 'D', text: 'To compare travel and university study' }
        ],
        correctAnswer: 'A',
        explanation: 'The business owner is an example of how adults can connect new words to real situations.'
      },
      {
        id: 5,
        questionText: 'What attitude toward mistakes does the passage recommend?',
        questionType: 'detail',
        options: [
          { letter: 'A', text: 'Avoid speaking until English is perfect' },
          { letter: 'B', text: 'Accept mistakes as part of learning' },
          { letter: 'C', text: 'Ignore all grammar problems forever' },
          { letter: 'D', text: 'Stop studying after the first mistake' }
        ],
        correctAnswer: 'B',
        explanation: 'The final paragraph says successful adult learners accept that mistakes are part of the process.'
      }
    ],
    createdAt: new Date('2024-03-20')
  }
];
