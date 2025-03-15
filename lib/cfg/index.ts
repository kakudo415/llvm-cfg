import { Function, BasicBlock } from '@/lib/parser';

export interface CFGNode {
  id: string;
  label: string;
  content: string;
}

export interface CFGEdge {
  source: string;
  target: string;
  label?: string;
}

export interface CFG {
  nodes: CFGNode[];
  edges: CFGEdge[];
}

/**
 * パースされたLLVM IR関数からCFGを生成する
 * @param functions パースされた関数の配列
 * @returns CFGデータ
 */
export function generateCFG(functions: Function[]): CFG {
  if (!functions || functions.length === 0) {
    throw new Error('関数が見つかりません');
  }

  // 最初の関数のみを処理（複数関数のサポートは将来的な拡張）
  const func = functions[0];

  const nodes: CFGNode[] = [];
  const edges: CFGEdge[] = [];

  // 基本ブロックをノードに変換
  func.basicBlocks.forEach(block => {
    // ノードのコンテンツを作成
    const content = [
      ...block.instructions,
      block.terminatorInstruction
    ].join('\n');

    // ノードを追加
    nodes.push({
      id: block.label,
      label: block.label,
      content: content
    });

    // エッジを追加
    if (block.successors.length > 0) {
      // 条件分岐の場合
      if (block.successors.length === 2 && block.terminatorInstruction.includes('br i1')) {
        // 条件分岐の条件を抽出
        const condMatch = block.terminatorInstruction.match(/br\s+i1\s+([^,]+)/);
        const condition = condMatch ? condMatch[1].trim() : '';

        // trueの場合のエッジ
        edges.push({
          source: block.label,
          target: block.successors[0],
          label: `true (${condition})`
        });

        // falseの場合のエッジ
        edges.push({
          source: block.label,
          target: block.successors[1],
          label: `false (${condition})`
        });
      }
      // switch文の場合
      else if (block.terminatorInstruction.includes('switch')) {
        // デフォルトケース
        edges.push({
          source: block.label,
          target: block.successors[0],
          label: 'default'
        });

        // その他のケース
        for (let i = 1; i < block.successors.length; i++) {
          edges.push({
            source: block.label,
            target: block.successors[i],
            label: `case ${i}`
          });
        }
      }
      // 無条件分岐の場合
      else {
        edges.push({
          source: block.label,
          target: block.successors[0]
        });
      }
    }
  });

  return { nodes, edges };
}

/**
 * CFGデータを整形する（レイアウトの最適化など）
 * @param cfg 元のCFGデータ
 * @returns 整形されたCFGデータ
 */
export function optimizeCFG(cfg: CFG): CFG {
  // 現時点では単純に元のCFGを返す
  // 将来的にはノードの配置最適化などを実装
  return cfg;
}
