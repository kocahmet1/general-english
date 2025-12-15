import OpenAI from 'openai';
import { Question, GrammarCategory } from '../types';

// Initialize OpenAI client
const getOpenAIClient = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
  });
};

// Valid grammar categories for classification
const VALID_CATEGORIES: GrammarCategory[] = [
  'past_perfect', 'present_perfect', 'past_simple', 'present_simple',
  'future_tenses', 'continuous_tenses', 'prepositions', 'articles',
  'vocabulary', 'phrasal_verbs', 'conditionals', 'modal_verbs',
  'gerunds_infinitives', 'passive_voice', 'relative_clauses',
  'reported_speech', 'conjunctions', 'idioms_expressions', 'collocations',
  'comparatives_superlatives', 'subject_verb_agreement', 'pronouns',
  'word_order', 'quantifiers', 'other'
];

// Response type for explanation with category
export interface ExplanationResponse {
  explanation: string;
  grammarCategory: GrammarCategory;
}

export async function getExplanation(
  question: Question,
  selectedAnswer: string,
  correctAnswer: string
): Promise<ExplanationResponse> {
  try {
    const openai = getOpenAIClient();
    
    // Format the question for the prompt
    const optionsText = question.options
      .map(opt => `${opt.letter}) ${opt.text}`)
      .join('\n');
    
    const selectedOptionText = question.options.find(o => o.letter === selectedAnswer)?.text || selectedAnswer;
    const correctOptionText = question.options.find(o => o.letter === correctAnswer)?.text || correctAnswer;
    
    const prompt = `Sen bir İngilizce öğretmenisin. Bir öğrenci aşağıdaki soruyu yanlış cevapladı. 

**Soru (İngilizce):**
${question.questionText}

**Seçenekler:**
${optionsText}

**Öğrencinin cevabı:** ${selectedAnswer}) ${selectedOptionText}
**Doğru cevap:** ${correctAnswer}) ${correctOptionText}

Lütfen aşağıdaki JSON formatında yanıt ver:

{
  "grammarCategory": "<CATEGORY>",
  "explanation": "<EXPLANATION>"
}

**grammarCategory** alanı için SADECE aşağıdaki değerlerden BİRİNİ seç (sorunun ana konusuna göre):
- past_perfect (Past Perfect - had + V3)
- present_perfect (Present Perfect - have/has + V3)
- past_simple (Past Simple - V2)
- present_simple (Present Simple)
- future_tenses (Future - will, going to)
- continuous_tenses (Continuous/Progressive tenses)
- prepositions (Edatlar - in, on, at, etc.)
- articles (Articles - a, an, the)
- vocabulary (Kelime bilgisi / Word choice)
- phrasal_verbs (Phrasal Verbs - get up, look after, etc.)
- conditionals (Conditionals - If clauses)
- modal_verbs (Modal Verbs - can, could, must, etc.)
- gerunds_infinitives (Gerunds & Infinitives - -ing / to + verb)
- passive_voice (Passive Voice)
- relative_clauses (Relative Clauses - who, which, that)
- reported_speech (Reported Speech)
- conjunctions (Conjunctions - and, but, because, etc.)
- idioms_expressions (Idioms & Expressions)
- collocations (Collocations - word combinations)
- comparatives_superlatives (Comparatives & Superlatives)
- subject_verb_agreement (Subject-Verb Agreement)
- pronouns (Pronouns)
- word_order (Word Order)
- quantifiers (Quantifiers - some, any, much, many)
- other (Diğer)

**explanation** alanında Türkçe olarak (sadece İngilizce kelimeler ve örnek cümleler hariç) şunları açıkla:

1. **Neden öğrencinin cevabı yanlış?** - Öğrencinin seçtiği cevabın neden bu bağlamda uygun olmadığını açıkla.

2. **Neden doğru cevap bu?** - Doğru cevabın neden doğru olduğunu detaylı bir şekilde açıkla.

3. **Dilbilgisi/Kelime Açıklaması:** - Bu soruyla ilgili gramer konusunu veya kelime kullanımını açıkla.

4. **Örnek Cümleler:** - Doğru kullanımı gösteren 2-3 örnek cümle ver (İngilizce cümleler, Türkçe çevirileriyle birlikte).

SADECE JSON formatında yanıt ver, başka bir şey yazma.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Sen deneyimli bir İngilizce öğretmenisin. IELTS ve TOEFL sınavlarına hazırlanan öğrencilere yardım ediyorsun. Yanıtlarını SADECE istenen JSON formatında ver. Açıklamalarını Türkçe yap, sadece İngilizce kelimeler, terimler ve örnek cümleler İngilizce olsun.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      return {
        explanation: 'Açıklama oluşturulamadı.',
        grammarCategory: 'other'
      };
    }

    try {
      const parsed = JSON.parse(content);
      const category = VALID_CATEGORIES.includes(parsed.grammarCategory) 
        ? parsed.grammarCategory 
        : 'other';
      
      return {
        explanation: parsed.explanation || 'Açıklama oluşturulamadı.',
        grammarCategory: category
      };
    } catch {
      // If JSON parsing fails, return the content as explanation
      return {
        explanation: content,
        grammarCategory: 'other'
      };
    }
  } catch (error) {
    console.error('Error getting explanation:', error);
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return {
          explanation: 'OpenAI API anahtarı yapılandırılmamış. Lütfen .env dosyasında VITE_OPENAI_API_KEY değerini ayarlayın.',
          grammarCategory: 'other'
        };
      }
      return {
        explanation: `Açıklama alınırken hata oluştu: ${error.message}`,
        grammarCategory: 'other'
      };
    }
    return {
      explanation: 'Açıklama alınırken bir hata oluştu. Lütfen tekrar deneyin.',
      grammarCategory: 'other'
    };
  }
}

// Extract vocabulary words from a question (for vocab vault feature)
export function extractVocabularyWords(question: Question): string[] {
  // Extract words from question text (words in blanks or key vocabulary)
  const questionWords = question.questionText
    .replace(/_+/g, '') // Remove blanks
    .split(/\s+/)
    .filter(word => word.length > 3 && /^[a-zA-Z]+$/.test(word));
  
  // Extract words from options
  const optionWords = question.options
    .map(opt => opt.text)
    .filter(text => text.length > 2 && /^[a-zA-Z\s]+$/.test(text));
  
  // Combine unique words
  const allWords = [...questionWords, ...optionWords];
  const uniqueWords = [...new Set(allWords.map(w => w.toLowerCase()))];
  
  return uniqueWords.filter(word => {
    // Filter out very common words
    const commonWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'has', 'have', 'been', 'will', 'more', 'when', 'who', 'been', 'call', 'find', 'each', 'from', 'their', 'there', 'this', 'that', 'with', 'they', 'were', 'said', 'what', 'your'];
    return !commonWords.includes(word);
  });
}

