(function (global) {
  var TONES = [
    { id: 'original', name: '均衡型' },
    { id: 'direct', name: '直接型' },
    { id: 'encouraging', name: '鼓励型' },
    { id: 'questioning', name: '启发型' }
  ];

  var LENGTHS = [
    { id: 'short', name: '简洁型' },
    { id: 'medium', name: '均衡型' },
    { id: 'detailed', name: '详细型' }
  ];

  var DEMO_GRADE = 'primary';

  var COMMENT_COPY = {
    primary: {
      variants: {
        short: {
          original: '主要情节基本完整，但第三段经过还比较简略。建议把事情发生、发展的过程再写具体一些。',
          direct: '第三段经过较为简略，过程推进得有些快。需把事情发生、发展的过程写具体，不要一笔带过。',
          encouraging: '主要情节基本完整，已经有了较好的基础。第三段经过再写得细一些，相信你能改好，文章也会更有画面感。',
          questioning: '主要情节基本完整，基础不错。第三段还可以想一想：事情是怎样一步步发生、发展的？想清楚这一点，过程就能写得更具体。'
        },
        medium: {
          original: '故事的主要情节已经写得比较完整了，但第三段写事情经过时还比较简略，过程推进得有些快，场景和细节的描写还不够充分。建议把事情发生、发展的过程再写具体一些。',
          direct: '第三段写事情经过时还比较简略，过程推进得有些快，场景和细节的描写还不够充分，这一段需要重点扩充。把事情发生、发展的过程写具体一些，不要一笔带过。',
          encouraging: '故事的主要情节已经写得比较完整了，说明你已经把事情想清楚了。第三段写事情经过时还可以再展开一些，把事情发生、发展的过程写得更具体。如果能再耐心补一补，文章会更有画面感，也会更生动。',
          questioning: '故事的主要情节已经写得比较完整了，有了不错的基础。第三段写事情经过时还可以再展开一些：事情是怎么一步步发生、发展的？当时看到了什么、感受到了什么？把这些问题想清楚，过程就能写得更具体。'
        },
        detailed: {
          original: '故事的主要情节已经写得比较完整了，能看出事情的大致经过。第三段写事情经过时还比较简略，过程推进得有些快，场景和细节的描写还不够充分。建议把事情发生、发展的过程再写具体一些，比如写清当时发生了什么、人物有怎样的反应、自己有哪些感受。这样读起来会更连贯，也更有画面感。',
          direct: '第三段写事情经过时还比较简略，过程推进得有些快，场景和细节的描写还不够充分，这一段需要重点扩充。修改时不要只交代结果，要把事情发生、发展的过程写具体：当时发生了什么，人物有什么动作或反应，自己有什么感受，都可以适当补充。这样才能避免一笔带过，让内容更充实。',
          encouraging: '故事的主要情节已经写得比较完整了，说明你已经抓住了这件事的重点，这是很值得肯定的。第三段写事情经过时还可以再展开一些，把事情发生、发展的过程写得更具体，比如补充当时的场景、人物的反应和自己的感受。如果能再耐心打磨这一段，文章会更有画面感，故事也会更生动，更容易吸引读者读下去。',
          questioning: '故事的主要情节已经写得比较完整了，有了不错的基础。第三段写事情经过时还可以再展开一些。不妨想一想：事情是怎么一步步发生、发展的？当时周围是什么样的？人物有什么动作或反应？你自己又有什么感受？把这些问题想清楚，再补充到第三段里，过程就会更具体，故事也会更有画面感。'
        }
      }
    },
    junior: {
      variants: {
        short: {
          original: '中心清楚，问题在第二段论据偏泛。补一个具体事例，写明它如何支撑观点，结尾再回扣中心。',
          direct: '第二段论据不够有力，和观点衔接不紧。换成具体事例，加一句分析，结尾点题。',
          encouraging: '中心已经比较清楚。把第二段例子写具体，再补一句分析，文章的说服力会明显提升。',
          questioning: '第二段的例子真的能证明观点吗？换成一次具体经历，再想想结尾怎样回到中心。'
        },
        medium: {
          original: '文章中心比较清楚，开头能较快进入主题。第二段的论据与观点联系还不够紧密，建议补充更具体的事例，并在结尾回扣中心，增强说服力。',
          direct: '中心和开头没有明显问题，短板集中在第二段。现在的论据偏泛，没把“为什么能证明观点”说清。请补进一个具体事例，写清事件、细节和结果，再用一句分析扣回观点；结尾也要点题，避免只停在表态。',
          encouraging: '文章的中心比较清楚，开头进入主题也顺畅，说明你的思路是站得住的。下一步可以把第二段写得更实：补一个真实、具体的事例，再说明它怎样支撑观点。结尾再轻轻点回中心，文章会更稳、更有说服力。',
          questioning: '你的观点已经立住了。再回看第二段：这个论据是“提到观点”，还是“证明观点”？如果换成一次具体经历，写出关键细节和结果，再在结尾回到中心，读者会不会更容易被说服？'
        },
        detailed: {
          original: '文章中心比较清楚，开头能较快进入主题，整体方向是对的。主要不足在第二段：论据还偏概括，和观点之间缺少一层分析，读者不容易看出它为什么能证明中心。建议补充一次更具体的经历，写清人物、事件、关键细节和结果，再用一两句话说明这个事例与观点的关系。结尾再回扣中心，文章会更完整，也更有说服力。',
          direct: '文章的问题不在立意，而在论证力度。第二段目前只是提出了一个较笼统的材料，缺少具体情境和必要分析，导致观点看起来没有被真正证明。修改时请把这一段作为重点：先换成一个贴近主题的具体事例，写清发生了什么、结果如何；再明确点出这个事例为什么能支撑观点。结尾不要泛泛收束，要回到中心句。这样改后，文章的结构会更清楚，论证也更有力度。',
          encouraging: '这篇文章的基础是不错的：中心比较明确，开头也能较快把读者带入主题，说明你已经知道自己想表达什么。接下来最值得打磨的是第二段。可以把现在较概括的论据换成一次真实、具体的经历，写出关键场景、人物反应和事情结果，再补上一句自己的理解，说明它怎样证明观点。结尾如果能呼应中心，整篇文章会从“意思清楚”进一步变成“有细节、有力量”。',
          questioning: '这篇文章已经有了比较清楚的中心。继续修改时，可以围绕第二段追问自己：我现在写的论据，是不是只是重复观点？有没有一个更具体、更有代表性的经历能证明它？这个经历里最关键的细节是什么？读者读完后，能不能自然明白它和观点的关系？结尾是否再次把这些内容收束到中心上？把这些问题一一想清楚后再改，文章的层次、逻辑和说服力都会更明显。'
        }
      }
    }
  };

  var STORAGE_KEY = 'cc-report-style-state';

  function getCommentPack() {
    return COMMENT_COPY[DEMO_GRADE] || COMMENT_COPY.primary;
  }

  function getOriginalText() {
    return getCommentPack().variants.medium.original;
  }

  function getPreviewText(tone, length) {
    var pack = getCommentPack();
    return pack.variants[length][tone];
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { tone: 'original', length: 'medium' };
      var parsed = JSON.parse(raw);
      return {
        tone: parsed.tone || 'original',
        length: parsed.length || 'medium'
      };
    } catch (e) {
      return { tone: 'original', length: 'medium' };
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  global.ReportStyleConfig = {
    TONES: TONES,
    LENGTHS: LENGTHS,
    COMMENT_COPY: COMMENT_COPY,
    STORAGE_KEY: STORAGE_KEY,
    getCommentPack: getCommentPack,
    getOriginalText: getOriginalText,
    getPreviewText: getPreviewText,
    loadState: loadState,
    saveState: saveState
  };
})(typeof window !== 'undefined' ? window : globalThis);
