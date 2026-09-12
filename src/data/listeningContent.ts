import type { ListeningQuestion, ListeningTest, ListeningTurn } from '../types';

// Original TOEFL-style practice, using the extended conversation / lecture format.
// Each transcript and recording is derived from these same speaker turns.
type Passage = Omit<ListeningTest, 'transcript' | 'audioText' | 'audioUrl' | 'duration' | 'createdAt'>;

function question(
  id: number, questionType: ListeningQuestion['questionType'], questionText: string,
  choices: [string, string, string, string], correctAnswer: string, explanation: string,
  extra: Pick<ListeningQuestion, 'answerCount' | 'replayTurnIndex'> = {}
): ListeningQuestion {
  return { id, questionType, questionText, options: choices.map((text, i) => ({ letter: 'ABCD'[i], text })), correctAnswer, explanation, ...extra };
}

function lectureTurns(text: string, voice: ListeningTurn['voice']): ListeningTurn[] {
  return text.trim().split('\n\n').map(text => ({ speaker: 'Professor', voice, text }));
}

export const listeningContent: Passage[] = [
  {
    id: 'toefl-conversation-research-project', section: 'conversation',
    title: 'Rethinking a Research Project', topic: 'Campus Life · Office Hours', difficulty: 'medium',
    context: 'Listen to a conversation between a student and her environmental studies professor.',
    turns: [
      { speaker: 'Student', voice: 'nova', text: "Hi, Professor Miller. Do you have a minute to talk about my research proposal? I wanted to compare the effects of trees on summer temperatures in three neighborhoods, but the city office just told me their detailed temperature records won't be available until next semester. Our paper is due in five weeks." },
      { speaker: 'Professor', voice: 'onyx', text: "Come in, Maya. I remember your proposal. You were interested in how shade changes the experience of walking through a neighborhood. Have you considered collecting your own observations instead of depending on the city's records?" },
      { speaker: 'Student', voice: 'nova', text: "I have, but that's what worries me. I don't have enough time to visit three neighborhoods repeatedly. And even if I could borrow temperature sensors, I couldn't leave them on public sidewalks overnight. I thought maybe I should just choose a completely different topic." },
      { speaker: 'Professor', voice: 'onyx', text: "Let's not throw out a good question just because the original plan is too ambitious. A smaller study can still tell us something useful. What about the two paths between the library and the science building? One has mature trees, and the other is mostly exposed pavement." },
      { speaker: 'Student', voice: 'nova', text: "So, compare those paths? I walk through there every afternoon. But people choose the shaded path for other reasons, too. It has benches, and it's farther from the delivery entrance. If more people use it, that wouldn't necessarily prove that they prefer the temperature." },
      { speaker: 'Professor', voice: 'onyx', text: "Exactly. That's a limitation worth discussing. Don't make pedestrian counts your only evidence. Measure temperatures at both locations during the same time periods, then ask a small number of pedestrians why they chose their route. The interviews can help you interpret the counts." },
      { speaker: 'Student', voice: 'nova', text: "Would three afternoons be enough? I can collect data on Monday, Wednesday, and Friday, but I work at the bookstore on the other days." },
      { speaker: 'Professor', voice: 'onyx', text: "For this course, yes, as long as you describe the conditions carefully. If one afternoon is cloudy and the others are sunny, don't combine all the numbers without mentioning that difference. You're testing a method, not making a claim about the entire city." },
      { speaker: 'Student', voice: 'nova', text: "That makes the project feel manageable. What about the sensors? The equipment desk said most of them were reserved for the field ecology class." },
      { speaker: 'Professor', voice: 'onyx', text: "I have two handheld sensors you can borrow during the afternoons. First, send me a revised proposal with your measurement schedule and two or three interview questions. Once we've agreed on those, I'll arrange the equipment." },
      { speaker: 'Student', voice: 'nova', text: "Great. I'll send the revision tomorrow morning. I was worried that narrowing the project would make it less interesting, but now I can see how the interviews might actually make the results easier to explain." },
      { speaker: 'Professor', voice: 'onyx', text: "That's the idea. A clear question and evidence you can actually collect are more valuable than a broad project you can't finish." }
    ],
    questions: [
      question(1, 'main_idea', 'Why does the student visit the professor?', [
        'To request a higher grade on a completed research paper', 'To revise a research plan after an important data source becomes unavailable',
        'To obtain permission to miss a field ecology class', 'To ask for an extension because of her bookstore job'
      ], 'B', 'The city records will not be ready before the deadline, so Maya needs to change how she will investigate her research question.'),
      question(2, 'function', 'Why does the professor say, “Let’s not throw out a good question”?', [
        'To suggest that the student should save a printed questionnaire', 'To criticize the city for delaying its records',
        'To encourage the student to keep her topic while reducing the scope', 'To insist that she continue comparing three neighborhoods'
      ], 'C', 'He immediately proposes a smaller comparison of two campus paths. He is encouraging a more practical version of the same research idea.', { replayTurnIndex: 3 }),
      question(3, 'detail', 'Why does the professor recommend interviewing pedestrians?', [
        'Their reasons for choosing a path can help explain the pedestrian counts', 'They can provide the missing city temperature records',
        'They can carry the sensors overnight', 'Their responses will eliminate the need to measure temperatures'
      ], 'A', 'Benches and distance from deliveries could affect route choices. Interviews help distinguish these explanations from temperature preferences.'),
      question(4, 'attitude', 'How does the student feel about the revised project by the end of the conversation?', [
        'Disappointed that the professor has chosen an unrelated topic', 'Certain that the study will represent the whole city',
        'Reluctant to collect any observations herself', 'More confident that the project is feasible and can produce useful evidence'
      ], 'D', 'She calls the project manageable and recognizes that interviews can help explain the results, showing increased confidence.'),
      question(5, 'inference', 'What will the student most likely do before borrowing the sensors?', [
        'Wait until the next semester for city records', 'Submit a revised schedule and interview questions for the professor to review',
        'Cancel all three afternoon observations', 'Ask the bookstore to purchase equipment'
      ], 'B', 'The professor will arrange the equipment after they agree on her revised proposal. She says she will send it the next morning.')
    ]
  },
  {
    id: 'toefl-conversation-library-exhibit', section: 'conversation',
    title: 'Planning a Library Exhibit', topic: 'Campus Life · Student Services', difficulty: 'medium',
    context: 'Listen to a conversation between a student and a university librarian.',
    turns: [
      { speaker: 'Student', voice: 'onyx', text: "Hi. I'm Daniel, from the campus history club. We reserved the library lobby for an exhibit about student life fifty years ago. I came to ask about borrowing some original photographs from the university archives." },
      { speaker: 'Librarian', voice: 'nova', text: "I saw the reservation. It's for the week of the alumni reunion, right? The photographs are available for research, but we can't display the originals in the lobby. There's too much direct sunlight, and the cases there don't control humidity." },
      { speaker: 'Student', voice: 'onyx', text: "Oh. We thought the original photographs would make the exhibit feel more authentic. If we moved it to the reading room upstairs, would that solve the problem?" },
      { speaker: 'Librarian', voice: 'nova', text: "The environment would be better, but that room has to remain quiet for researchers. Your club's plan includes students explaining the exhibits to visitors. I'd recommend keeping the lobby and using high-resolution reproductions." },
      { speaker: 'Student', voice: 'onyx', text: "I suppose most visitors wouldn't notice the difference. Could the club scan the photographs ourselves? We have a volunteer with a good scanner, and we're trying to keep our costs down." },
      { speaker: 'Librarian', voice: 'nova', text: "Only archive staff can handle the fragile items, but many of these photographs have already been scanned. You can download those files at no charge. For anything that hasn't been digitized, submit a request this week. New scans usually take several working days." },
      { speaker: 'Student', voice: 'onyx', text: "That's a relief. We have money for printing, just not for a lot of scanning fees. We also found letters from former students in the archive catalog. Could we display extracts alongside the pictures?" },
      { speaker: 'Librarian', voice: 'nova', text: "Possibly, but check the permission notes for each letter. Some donors restricted public use. A letter being available for researchers doesn't automatically mean you can put its contents on a public display. I'll help you identify a few with suitable permissions." },
      { speaker: 'Student', voice: 'onyx', text: "Thanks. We were going to arrange everything by decade, but with only one week for the exhibit, I'm afraid people will just walk past a long timeline." },
      { speaker: 'Librarian', voice: 'nova', text: "Why not organize it around daily experiences, like finding a place to live or joining a club? Put an older photograph next to a current one of a similar activity. Visitors can make comparisons even if they only stop for a minute." },
      { speaker: 'Student', voice: 'onyx', text: "I like that. We could ask visitors to write down a memory of their own. Would a table with cards block the entrance?" },
      { speaker: 'Librarian', voice: 'nova', text: "A narrow table beside the display cases should be fine. Send me a sketch of the layout so the facilities staff can check that the entrance stays clear. And label the memory cards as voluntary contributions; visitors should know those cards may become part of the exhibit." },
      { speaker: 'Student', voice: 'onyx', text: "Okay. I'll look through the digitized collection first and send the sketch after our club meeting tonight. This actually gives us more ways to involve people than simply displaying old photographs." }
    ],
    questions: [
      question(1, 'main_idea', 'What are the speakers mainly discussing?', [
        'How to recruit library employees for a history course', 'Why the university should cancel an alumni reunion',
        'How to create a practical and engaging exhibit using archive materials', 'Where to store a new donation of student letters'
      ], 'C', 'They discuss reproductions, permissions, thematic organization, and visitor participation as practical ways to create the club’s exhibit.'),
      question(2, 'detail', 'What TWO reasons does the librarian give for not displaying original photographs in the lobby? Choose two answers.', [
        'The lobby receives too much direct sunlight', 'The photographs have not been cataloged',
        'The lobby cases do not control humidity', 'The lobby is reserved for quiet research'
      ], 'A,C', 'She specifically mentions sunlight and the lack of humidity control. The quiet research restriction applies to the upstairs reading room.', { answerCount: 2 }),
      question(3, 'function', 'Why does the student say, “That’s a relief”?', [
        'He has learned that the reunion was postponed', 'He has learned that many digital photographs are available without a scanning fee',
        'He has received permission to handle fragile originals', 'He has discovered that printing will be free'
      ], 'B', 'The club has a printing budget but is concerned about scanning fees. Existing scans are free to download, which eases that concern.', { replayTurnIndex: 6 }),
      question(4, 'inference', 'What does the librarian imply about letters in the archive?', [
        'All letters must be shown in their entirety', 'All donors have agreed to public exhibitions',
        'Researchers are not allowed to read restricted letters', 'Access for research and permission for public display are separate matters'
      ], 'D', 'She explains that availability to researchers does not automatically authorize public display and offers to check individual permission notes.'),
      question(5, 'connecting_content', 'How would the librarian’s suggested organization help visitors?', [
        'It would let visitors quickly compare similar aspects of past and present student life', 'It would require visitors to study a complete chronological timeline',
        'It would remove the need to select photographs', 'It would allow original photographs to be placed in sunlight'
      ], 'A', 'Thematic pairs of older and current photographs make comparisons accessible to visitors who stop only briefly.')
    ]
  },
  {
    id: 'toefl-lecture-urban-heat', section: 'lecture', title: 'Why Cities Stay Warm',
    topic: 'Environmental Science · Urban Climate', difficulty: 'medium',
    context: 'Listen to part of a lecture in an environmental science class.',
    turns: lectureTurns(`Last time, we discussed how regional climate affects cities. Today, let's reverse that question: how can a city affect its own local temperature? Imagine riding a bicycle from a park into a downtown district just after sunset. The weather forecast is the same for both places, but the air downtown may feel noticeably warmer. This pattern is called the urban heat island effect. To understand it, we need to look beyond the temperature of the air and think about what happens to energy throughout the day.

First, consider surfaces. A dark asphalt parking lot absorbs much of the sunlight that reaches it. Concrete and other construction materials can also store substantial amounts of heat. After sunset, those surfaces release stored energy into the surrounding air. This helps explain why a city may remain warm long after a nearby vegetated area has cooled. The effect isn't simply that cities receive more sunlight. Two locations can receive similar sunlight and still handle that energy differently.

Vegetation changes the energy balance in two ways. Trees shade the ground, reducing the sunlight absorbed by surfaces beneath them. Plants also release water vapor through their leaves, a process called transpiration. Evaporation requires energy, so some energy that might otherwise warm a surface is used to change liquid water into vapor. Think of the cooling you feel when water evaporates from your skin. The comparison isn't exact, but it illustrates the role of an energy transfer that a dry parking lot cannot provide.

Now, before you conclude that planting trees anywhere will solve the problem, there are some complications. A young tree with a small canopy provides less shade than a mature tree. A species that requires frequent watering may be difficult to maintain where water is scarce. And the arrangement of buildings matters, too. Tall buildings can shade a street during the day, yet a narrow street bordered by buildings may release heat less efficiently at night. The same feature can have different effects at different times.

Cities can also use reflective roofs. These surfaces reflect a greater share of incoming sunlight, so less energy is absorbed by the roof. Notice how this differs from transpiration: the roof doesn't need to turn water into vapor to reduce its absorption of solar energy. However, a roof treatment primarily changes conditions at and around the building. It does not automatically provide shade for pedestrians waiting at a bus stop. Choosing an intervention therefore requires deciding exactly whose exposure you want to reduce.

Suppose a city tests trees at one bus stop and a reflective shelter roof at another. If researchers measure only the air temperature at noon on one day, they may miss important differences. They should also consider radiant heat from nearby surfaces, the shade that reaches waiting passengers, and conditions at several times of day. A surface can be extremely hot without raising the temperature of all the surrounding air by the same amount. One measurement cannot describe every aspect of a person's heat exposure.

So the urban heat island is a useful general pattern, but it is not a statement that every city block is equally warm. Materials, vegetation, water availability, and building form interact. When we compare solutions, we should connect each proposed change to the physical process it affects and to the people it is intended to help. In our next class, you'll evaluate two street designs and explain which measurements would let you compare them fairly.`, 'onyx'),
    questions: [
      question(1, 'main_idea', 'What is the lecture mainly about?', [
        'How weather forecasts are produced for large cities', 'Why city design affects local heat and how different interventions address it',
        'Why all city streets should use the same building materials', 'How regional climates determine the size of cities'
      ], 'B', 'The professor explains heat storage, vegetation, building form, and reflective roofs, then connects those mechanisms to evaluating cooling measures.'),
      question(2, 'detail', 'Why can a downtown area remain warm after sunset?', [
        'Trees release additional sunlight at night', 'Reflective roofs begin absorbing water',
        'Construction materials release energy stored during the day', 'The city starts receiving more solar energy after dark'
      ], 'C', 'Asphalt, concrete, and other materials store daytime heat and release that energy after sunset.'),
      question(3, 'function', 'Why does the professor mention water evaporating from a person’s skin?', [
        'To give a familiar example of cooling associated with evaporation', 'To show that people and trees need identical amounts of water',
        'To argue that skin absorbs more sunlight than asphalt', 'To explain why reflective roofs must remain wet'
      ], 'A', 'The familiar sensation helps explain how energy used to evaporate water can provide cooling.', { replayTurnIndex: 2 }),
      question(4, 'connecting_content', 'How do reflective roofs and transpiration differ?', [
        'Both work only by increasing shade at ground level', 'Reflective roofs store water, while transpiration stores concrete',
        'Transpiration reflects sunlight, while roofs produce water vapor', 'Reflective roofs reduce absorbed sunlight, while transpiration uses energy to evaporate water'
      ], 'D', 'The lecture explicitly distinguishes reflecting incoming energy from using energy to convert liquid water into vapor.'),
      question(5, 'inference', 'What can be inferred about a narrow street lined with tall buildings?', [
        'Its daytime shading guarantees that it will be the coolest street at night', 'Its buildings may provide daytime shade while also slowing nighttime cooling',
        'It receives no solar energy at any time', 'It cannot benefit from any additional vegetation'
      ], 'B', 'The professor explains that the same building arrangement can shade a street by day and reduce efficient heat release at night.'),
      question(6, 'organization', 'How does the professor organize the lecture?', [
        'By listing historical city designs in chronological order', 'By defending a single solution and dismissing all others',
        'By explaining sources of urban warmth, comparing cooling mechanisms, and discussing how to evaluate them', 'By presenting survey results before defining the research question'
      ], 'C', 'The lecture moves from heat absorption and storage to vegetation and reflective roofs, then to measurements needed to compare interventions.')
    ]
  },
  {
    id: 'toefl-lecture-retrieval-practice', section: 'lecture', title: 'Learning by Remembering',
    topic: 'Psychology · Learning and Memory', difficulty: 'medium',
    context: 'Listen to part of a lecture in a psychology class.',
    turns: lectureTurns(`Let's start with a situation you probably recognize. You read a chapter, highlight several definitions, and read it again. Everything looks familiar, so you feel prepared. Then, on a quiz, you struggle to explain those definitions without the book. Why can the experience of studying feel so successful when later recall is difficult? Today we'll distinguish familiarity from retrieval and examine how that distinction can change the way we study.

Familiarity is the feeling that you've encountered information before. When the words remain in front of you, they provide cues that make the material seem easy to process. Retrieval involves bringing information to mind when some or all of those cues are absent. The two experiences overlap, but they aren't interchangeable. Recognizing a classmate in the classroom doesn't guarantee that you could produce that person's name if someone asked you about them later.

Researchers can compare study methods by giving two groups the same reading passage. One group rereads it during a second study period. The other group closes the passage and attempts to write down the main points from memory. Later, both groups take a test without the passage. In many experiments of this kind, practicing retrieval improves delayed recall more than an equivalent period of additional reading. The important word there is delayed. A strategy that produces smooth performance right now isn't necessarily the one that best supports remembering later.

Why might retrieval help? One explanation is that trying to reconstruct an idea strengthens access to it. Retrieval can also reveal gaps that rereading conceals. If I ask you to explain a concept and you cannot identify its central feature, you now have a specific target for further study. But there's a condition we shouldn't ignore: feedback. If you retrieve an incorrect answer and never check it, you may continue practicing that error. A useful routine is to try from memory, compare your response with a reliable source, and then correct what you missed.

Spacing matters as well. Suppose you answer a question correctly and repeat the same question immediately. The answer may still be active in your mind, making the second attempt almost effortless. Waiting until a later study session generally makes retrieval more demanding. That extra effort can be productive, provided you can still retrieve enough to learn from the attempt. This doesn't mean the longest possible delay is always best. If the material is completely inaccessible, you may need an earlier review or additional cues.

Here's a practical example. After a biology lecture, write three questions that connect the major ideas. The following day, answer them with your notes closed. Then check your explanations and revisit any weak points. Later in the week, answer those questions again, perhaps applying the ideas to a new example. Compare that with making a beautiful set of flashcards and only turning them over to read the answers. The cards themselves aren't the learning method. What matters is whether you actually attempt retrieval before looking.

We should be cautious about turning this research into a slogan. Rereading can help when you are meeting difficult material for the first time, and retrieval is not a substitute for understanding. The point is to align practice with what you will need to do later. If the goal is to explain an idea independently, your study routine should include attempts to explain it independently. Judge a strategy by what you can remember after a delay, not only by how comfortable it feels while your notes are open.`, 'nova'),
    questions: [
      question(1, 'main_idea', 'What is the main purpose of the lecture?', [
        'To prove that highlighting always damages memory', 'To recommend replacing every reading assignment with a quiz',
        'To explain why familiarity and retrieval differ and how retrieval can support learning', 'To compare the writing styles of psychology textbooks'
      ], 'C', 'The central distinction is between material feeling familiar and being able to retrieve it, with implications for study methods.'),
      question(2, 'function', 'Why does the professor mention recognizing a classmate but being unable to produce the classmate’s name?', [
        'To illustrate that recognition does not guarantee independent recall', 'To show that remembering names is impossible',
        'To suggest that classrooms interfere with learning', 'To explain why students should avoid social distractions'
      ], 'A', 'The example makes the difference between familiarity and retrieval concrete: recognizing someone is not the same as recalling a name.', { replayTurnIndex: 1 }),
      question(3, 'detail', 'According to the professor, why is feedback important after a retrieval attempt?', [
        'It prevents students from encountering difficult questions', 'It lets students correct errors they might otherwise keep practicing',
        'It makes delayed tests unnecessary', 'It ensures that every attempt is effortless'
      ], 'B', 'Without checking and correcting a response, a learner may repeatedly practice an incorrect answer.'),
      question(4, 'inference', 'What does the professor imply about choosing the interval between reviews?', [
        'The longest possible interval is always the most effective', 'Every topic should be reviewed after exactly the same interval',
        'Intervals matter only when students use flashcards', 'An interval should make recall demanding without making the material entirely inaccessible'
      ], 'D', 'Effort can help, but complete inaccessibility may require an earlier review or more cues. The interval must balance difficulty and successful retrieval.'),
      question(5, 'detail', 'Which TWO activities follow the professor’s recommendations? Choose two answers.', [
        'Answering questions with notes closed before checking the answers', 'Reading flashcard answers without attempting to recall them',
        'Returning to the questions in a later study session', 'Repeating an unchecked incorrect response until it feels familiar'
      ], 'A,C', 'The recommended routine combines retrieval before checking, corrective feedback, and practice spaced across later sessions.', { answerCount: 2 }),
      question(6, 'attitude', 'What is the professor’s attitude toward rereading?', [
        'It should be prohibited in psychology classes', 'It can be useful, but should not be the only preparation for independent recall',
        'It is always superior to retrieval on delayed tests', 'It helps only when students already know all the material'
      ], 'B', 'The professor acknowledges the value of rereading unfamiliar, difficult material while encouraging practice that matches the later goal of independent explanation.')
    ]
  },
  {
    id: 'toefl-lecture-pottery-trade', section: 'lecture', title: 'What Pottery Reveals About Trade',
    topic: 'Archaeology · Material Evidence', difficulty: 'hard',
    context: 'Listen to part of a lecture in an archaeology class.',
    turns: lectureTurns(`Today we're going to consider a deceptively simple question. If an archaeologist finds a bowl at an ancient coastal settlement, how can that bowl tell us anything about trade? You might imagine that an object travels with a label identifying its maker and destination. Usually it doesn't. We have fragments, their physical characteristics, and the places where they were found. Our challenge is to connect those observations to an explanation without asking the evidence to tell us more than it can.

Pottery is especially useful because fired clay can survive under conditions that destroy wood or cloth. A broken pot may be useless to its owner, yet its fragments can remain recognizable for centuries. Archaeologists examine shape, decoration, and manufacturing technique to group fragments into types. If a particular style appears at several settlements, that distribution gives us a starting point. But a shared style alone is not proof that finished pots moved between those places.

Why not? Imagine that a local potter sees an imported bowl and copies its painted pattern. Or imagine a potter moving to a new town and continuing to make familiar designs with local clay. In either case, the style travels in some sense, but the finished object may have been made near the place where it was discarded. This is why we distinguish the movement of objects from the movement of people and ideas. Those processes can create similar-looking evidence.

To investigate further, specialists study the clay and the mineral particles within it. A thin slice of pottery can be examined under a microscope, and chemical analyses can identify combinations of elements. These characteristics can be compared with clay sources or production waste from known workshops. If a vessel's material closely matches one region and differs from local sources, an imported origin becomes more plausible. Notice that I said plausible, not certain. Some regions share similar geology, and ancient potters sometimes mixed materials from different sources.

Context provides another line of evidence. Suppose matching vessels are found at an inland workshop, at a river landing, and at a coastal settlement. If the deposits belong to roughly the same period, that pattern is consistent with goods moving along a river route. Now suppose the coastal fragments actually come from a deposit two centuries later. Suddenly, a single trading network becomes a much weaker explanation. A map of find spots is incomplete unless we also consider time.

What was being traded? That question introduces another complication. A container may have been valued for its contents rather than for the container itself. Residues absorbed into pottery can sometimes provide evidence of substances it once held. Certain vessel shapes may also be convenient for transporting liquids. Still, an attractive shape doesn't prove what was inside, and a residue does not identify every journey a container made. Pots could be reused, repaired, or passed through several owners before being discarded.

Let's return to our coastal bowl. Its painted design resembles inland examples, its clay composition is consistent with an inland production area, and it appears in a deposit dated to the same period as activity at a river landing. Together, those observations support an exchange connection more strongly than the decoration alone. They do not tell us the merchant's name or whether the bowl traveled directly from the workshop to the coast. The strength of archaeological interpretation comes from combining independent clues while keeping alternative explanations in view.`, 'onyx'),
    questions: [
      question(1, 'main_idea', 'What is the lecture mainly about?', [
        'How ancient potters selected attractive painted designs', 'Why coastal settlements produced more bowls than inland settlements',
        'How to restore a broken pot for display in a museum', 'How several kinds of pottery evidence can be combined to investigate ancient exchange'
      ], 'D', 'The professor combines style, material composition, archaeological context, dating, and residues to explain how exchange can be investigated.'),
      question(2, 'detail', 'Why is pottery useful to archaeologists?', [
        'Every pot contains the name of its maker', 'Fired clay can survive where more perishable materials do not',
        'Its original contents always remain intact', 'It was made from identical clay in every region'
      ], 'B', 'Fired clay fragments can remain recognizable long after materials such as wood and cloth have been destroyed.'),
      question(3, 'function', 'Why does the professor discuss a potter moving to another town?', [
        'To show how a familiar style could appear on pottery made locally', 'To prove that finished pots were never traded',
        'To explain why potters avoided using local clay', 'To identify the owner of the coastal bowl'
      ], 'A', 'A migrant potter could use local clay while retaining familiar designs, so shared style need not indicate transport of a finished object.', { replayTurnIndex: 2 }),
      question(4, 'inference', 'Why would a much later date for the coastal deposit weaken the river-trade explanation?', [
        'Later pottery cannot be chemically analyzed', 'River transport was impossible after the earliest settlement',
        'The find spots might reflect activities from different periods rather than one trading network', 'Decoration would become a more precise dating method than the deposit'
      ], 'C', 'Geographically connected sites do not establish a single network if the relevant objects belong to very different periods.'),
      question(5, 'attitude', 'What attitude does the professor express toward chemical evidence for a vessel’s origin?', [
        'It is irrelevant whenever decoration is visible', 'It identifies a workshop with complete certainty in every case',
        'It should replace all contextual evidence', 'It is valuable, but geological similarities and mixed materials can limit certainty'
      ], 'D', 'The professor calls an imported origin plausible and immediately notes similar geology and the mixing of materials as limitations.'),
      question(6, 'connecting_content', 'Which TWO findings would strengthen the proposed inland-to-coast exchange connection? Choose two answers.', [
        'The bowl has a common decorative pattern but otherwise has only local characteristics', 'The bowl’s clay is consistent with the inland production area and differs from local sources',
        'Relevant finds at the workshop, river landing, and coast date to roughly the same period', 'The coastal bowl has no known find location or date'
      ], 'B,C', 'A material link to inland production and a compatible time frame supply independent support for the proposed route. A shared style by itself is weaker evidence.', { answerCount: 2 })
    ]
  },
  {
    id: 'toefl-lecture-exoplanets', section: 'lecture', title: 'Finding Planets We Cannot See',
    topic: 'Astronomy · Exoplanet Detection', difficulty: 'hard',
    context: 'Listen to part of a lecture in an astronomy class.',
    turns: lectureTurns(`When we look at a distant star, a planet orbiting it may be hidden in the star's glare. The star produces its own light, while the planet usually contributes very little to the total light we receive. So how can astronomers discover a planet they cannot directly distinguish from its star? Today we'll compare two indirect methods. Both look for repeated patterns, but they measure different physical effects and tell us different things about the planet.

The first is the transit method. If a planet's orbit is aligned so that it passes between us and its star, the planet blocks a small fraction of the starlight. Instruments record the star's brightness over time. A single dip could have several explanations, but similar dips at regular intervals are worth investigating. The interval between transits indicates the orbital period: how long the planet takes to complete one orbit. The depth of the dip tells us something different. Combined with information about the star's size, it helps estimate the planet's size.

Imagine a large lamp and two opaque disks, one small and one large. Move each disk across the lamp. The larger disk blocks more light, even if both disks move across at the same speed. That is the basic intuition behind using transit depth to estimate relative size. Real stars are more complicated than lamps, and astronomers must account for additional effects. But don't confuse the amount of blocked light with the time between events. Those observations answer different questions.

The second method uses the star's motion. We often say that a planet orbits a stationary star, but both objects actually move around their common center of mass. The star's motion is much smaller, yet instruments can sometimes detect it. When the star moves toward us or away from us, features in its spectrum shift slightly because of the Doppler effect. Repeated shifts can provide evidence of an orbiting companion. This is called the radial velocity method because it measures motion along our line of sight.

The size of that motion depends in part on the planet's mass, but also on how the orbit is tilted relative to us. Without knowing the tilt, radial velocity usually gives a lower limit on the planet's mass rather than a fully determined mass. If the same planet also transits, the transit provides information about the orbital alignment. Combining the methods can therefore improve the mass estimate. With estimates of both mass and radius, astronomers can calculate average density and investigate which broad compositions are consistent with the observations.

Neither method finds every planet. A planet may orbit a star without ever crossing the star's face from our perspective, so an absence of transits doesn't establish an absence of planets. And a planet that takes many years to complete an orbit requires a long observing campaign to confirm a repeating pattern. Large planets with short periods often produce signals that are easier to identify in limited data. The planets in a catalog therefore reflect both what exists and what our methods are good at detecting.

Finally, a candidate signal needs checking. Changes on a star's surface or an unresolved stellar companion can sometimes imitate part of the evidence. Repeated observations and independent measurements help test alternative explanations. Think of the two methods as complementary witnesses: one reports a change in brightness, the other a change in motion. Agreement between them can strengthen an interpretation, but it doesn't remove the need to understand each measurement's limits. Next week we'll examine a brightness graph and a velocity graph for the same system.`, 'nova'),
    questions: [
      question(1, 'main_idea', 'What is the main purpose of the lecture?', [
        'To compare two indirect methods of finding planets and explain how their evidence fits together', 'To explain how astronomers photograph the surface of every known planet',
        'To argue that brightness measurements have no scientific value', 'To list all planets that orbit the Sun'
      ], 'A', 'The lecture explains transit and radial velocity measurements, their complementary information, and their limitations.'),
      question(2, 'detail', 'What does the interval between repeated transits indicate?', [
        'The planet’s surface temperature', 'The star’s chemical composition',
        'The time the planet takes to complete one orbit', 'The amount of light produced by the planet'
      ], 'C', 'The time between comparable transits gives the orbital period. Transit depth is the measurement related to relative size.'),
      question(3, 'function', 'Why does the professor describe moving two disks across a lamp?', [
        'To demonstrate that all stars have identical brightness', 'To illustrate why a larger transiting object blocks a greater fraction of light',
        'To explain how the Doppler effect changes a spectrum', 'To show that orbital period is independent of every physical property'
      ], 'B', 'The analogy explains the connection between the size of an opaque object and the amount of light it blocks.', { replayTurnIndex: 2 }),
      question(4, 'connecting_content', 'Why is it useful to observe both transits and radial velocity for the same planet?', [
        'Both methods directly photograph the planet’s surface', 'Their combination guarantees that the planet contains liquid water',
        'Transit depth alone gives the planet’s exact mass', 'Together they can improve mass estimates and provide radius information for estimating density'
      ], 'D', 'Transit alignment helps interpret radial velocity, and transit size information combined with mass allows an average density estimate.'),
      question(5, 'inference', 'What can be inferred if a star shows no transits during an observing campaign?', [
        'Any planet around it must be smaller than Earth', 'No planet can orbit that star',
        'A planet could still be present but have an unsuitable alignment or a long orbital period', 'Radial velocity measurements would necessarily be impossible'
      ], 'C', 'The lecture identifies alignment and observing duration as limitations. A lack of observed transits is not proof that planets are absent.'),
      question(6, 'attitude', 'How does the professor view lists of detected planets?', [
        'As complete inventories unaffected by observing methods', 'As useful collections that are influenced by which signals are easiest to detect',
        'As unreliable because every signal is caused by a second star', 'As evidence that planets with long orbital periods cannot exist'
      ], 'B', 'The professor emphasizes detection bias: catalogs reflect both the actual population and the strengths and limits of the methods used.')
    ]
  }
];
