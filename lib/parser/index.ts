// LLVM IRパーサー

export interface BasicBlock {
  label: string;
  instructions: string[];
  terminatorInstruction: string;
  successors: string[];
}

export interface Function {
  name: string;
  basicBlocks: BasicBlock[];
}

/**
 * LLVM IRコードをパースして関数と基本ブロックの構造を抽出する
 * @param irCode LLVM IRコード
 * @returns パースされた関数の配列
 */
export function parseLLVMIR(irCode: string): Function[] {
  if (!irCode.trim()) {
    throw new Error('IRコードが空です');
  }

  const functions: Function[] = [];
  let currentFunction: Function | null = null;
  let currentBlock: BasicBlock | null = null;

  // 行ごとに処理
  const lines = irCode.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 空行はスキップ
    if (!line) continue;

    // 関数定義の検出
    const functionMatch = line.match(/^define\s+.*\s+@(\w+)\s*\(/);
    if (functionMatch) {
      // 新しい関数の開始
      currentFunction = {
        name: functionMatch[1],
        basicBlocks: []
      };
      functions.push(currentFunction);
      currentBlock = null;
      continue;
    }

    // 関数の終了
    if (line === '}' && currentFunction) {
      currentFunction = null;
      currentBlock = null;
      continue;
    }

    // 関数内の処理
    if (currentFunction) {
      // ラベルの検出（基本ブロックの開始）
      const labelMatch = line.match(/^(\w+):/);
      if (labelMatch) {
        // 新しい基本ブロックの開始
        currentBlock = {
          label: labelMatch[1],
          instructions: [],
          terminatorInstruction: '',
          successors: []
        };
        currentFunction.basicBlocks.push(currentBlock);
        continue;
      }

      // 命令の処理
      if (currentBlock) {
        // 終端命令の検出
        const brMatch = line.match(/^\s*br\s+i1\s+.*,\s*label\s+%(\w+),\s*label\s+%(\w+)/);
        if (brMatch) {
          // 条件分岐
          currentBlock.terminatorInstruction = line;
          currentBlock.successors.push(brMatch[1], brMatch[2]);
          continue;
        }

        const brUncondMatch = line.match(/^\s*br\s+label\s+%(\w+)/);
        if (brUncondMatch) {
          // 無条件分岐
          currentBlock.terminatorInstruction = line;
          currentBlock.successors.push(brUncondMatch[1]);
          continue;
        }

        const switchMatch = line.match(/^\s*switch\s+.*\s+label\s+%(\w+)\s+\[/);
        if (switchMatch) {
          // switch文の開始
          currentBlock.terminatorInstruction = line;
          currentBlock.successors.push(switchMatch[1]);

          // switch文のケースを抽出
          const caseMatches = line.match(/,\s*label\s+%(\w+)/g);
          if (caseMatches) {
            caseMatches.forEach(match => {
              const caseLabel = match.match(/,\s*label\s+%(\w+)/);
              if (caseLabel) {
                currentBlock!.successors.push(caseLabel[1]);
              }
            });
          }
          continue;
        }

        const retMatch = line.match(/^\s*ret\s+/);
        if (retMatch) {
          // 関数からの戻り
          currentBlock.terminatorInstruction = line;
          continue;
        }

        // その他の命令
        currentBlock.instructions.push(line);
      }
    }
  }

  // 空の関数や不完全な基本ブロックをフィルタリング
  return functions.filter(func => func.basicBlocks.length > 0);
}
