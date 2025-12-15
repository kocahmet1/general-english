import OpenAI from 'openai';
import { Question } from '../types';

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

export async function getExplanation(
  question: Question,
  selectedAnswer: string,
  correctAnswer: string
): Promise<string> {
  try {
    const openai = getOpenAIClient();
    
    // Format the question for the prompt
    const optionsText = question.options
      .map(opt => `${opt.letter}) ${opt.text}`)
      .join('\n');
    
    const selectedOptionText = question.options.find(o => o.letter === selectedAnswer)?.text || selectedAnswer;
    const correctOptionText = question.options.find(o => o.letter === correctAnswer)?.text || correctAnswer;
    
    const prompt = `Sen bir İngilizce öğretmenisin. Bir öğrenci aşağıdaki soruyu yanlış cevapladı. Türkçe olarak açıklama yap.

**Soru (İngilizce):**
${question.questionText}

**Seçenekler:**
${optionsText}

**Öğrencinin cevabı:** ${selectedAnswer}) ${selectedOptionText}
**Doğru cevap:** ${correctAnswer}) ${correctOptionText}

Lütfen şunları açıkla (Türkçe olarak, sadece İngilizce kelimeler ve örnek cümleler hariç):

1. **Neden öğrencinin cevabı yanlış?** - Öğrencinin seçtiği cevabın neden bu bağlamda uygun olmadığını açıkla.

2. **Neden doğru cevap bu?** - Doğru cevabın neden doğru olduğunu detaylı bir şekilde açıkla.

3. **Dilbilgisi/Kelime Açıklaması:** - Bu soruyla ilgili gramer konusunu veya kelime kullanımını açıkla. Örneğin:
   - Eğer soru bir zaman (tense) ile ilgiliyse, o zamanın ne zaman ve nasıl kullanıldığını açıkla
   - Eğer soru edatlar (prepositions) ile ilgiliyse, o edatların kullanım kurallarını açıkla
   - Eğer soru kelime bilgisi ile ilgiliyse, kelimelerin anlamlarını ve kullanım farklarını açıkla
   - Eğer soru deyimler (idioms) ile ilgiliyse, deyimin anlamını ve kökenini açıkla

4. **Örnek Cümleler:** - Doğru kullanımı gösteren 2-3 örnek cümle ver (İngilizce cümleler, Türkçe çevirileriyle birlikte).

Açıklamanı öğretici ve anlaşılır bir şekilde yaz.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Sen deneyimli bir İngilizce öğretmenisin. IELTS ve TOEFL sınavlarına hazırlanan öğrencilere yardım ediyorsun. Açıklamalarını Türkçe yap, sadece İngilizce kelimeler, terimler ve örnek cümleler İngilizce olsun.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    return response.choices[0]?.message?.content || 'Açıklama oluşturulamadı.';
  } catch (error) {
    console.error('Error getting explanation:', error);
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return 'OpenAI API anahtarı yapılandırılmamış. Lütfen .env dosyasında VITE_OPENAI_API_KEY değerini ayarlayın.';
      }
      return `Açıklama alınırken hata oluştu: ${error.message}`;
    }
    return 'Açıklama alınırken bir hata oluştu. Lütfen tekrar deneyin.';
  }
}

// Extract vocabulary words from a question (for vocab vault feature)
export function extractVocabularyWords(question: Question): string[] {
  const words: string[] = [];
  
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

