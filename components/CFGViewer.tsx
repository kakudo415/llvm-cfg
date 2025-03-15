import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as dagre from '@dagrejs/dagre';

// dagreのノード型を拡張
interface DagreNode extends dagre.Node {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  rx?: number;
  ry?: number;
  content?: string;
}

// dagreのエッジ型を拡張
interface DagreEdge {
  points: Array<{x: number, y: number}>;
  label?: string;
}

interface CFGNode {
  id: string;
  label: string;
  content: string;
}

interface CFGEdge {
  source: string;
  target: string;
  label?: string;
}

interface CFGData {
  nodes: CFGNode[];
  edges: CFGEdge[];
}

interface CFGViewerProps {
  data: CFGData | null;
}

const CFGViewer: React.FC<CFGViewerProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // SVGをクリア
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // グラフの作成
    const g = new dagre.graphlib.Graph().setGraph({
      rankdir: 'TB',
      marginx: 20,
      marginy: 20,
      ranksep: 50,
      nodesep: 50,
      edgesep: 10,
      acyclicer: 'greedy',
    });

    // ノードの追加
    data.nodes.forEach(node => {
      g.setNode(node.id, {
        label: node.label,
        width: 200,
        height: 100,
        rx: 5,
        ry: 5,
        content: node.content,
      });
    });

    // エッジの追加
    data.edges.forEach(edge => {
      g.setEdge(edge.source, edge.target, {
        label: edge.label || '',
        curve: d3.curveBasis,
        lineInterpolate: 'basis',
      });
    });

    // レイアウトの計算
    dagre.layout(g);

    // SVGグループの作成
    const svgGroup = svg.append('g');

    // ズーム機能の追加
    const zoom = d3.zoom()
      .on('zoom', (event) => {
        svgGroup.attr('transform', event.transform);
      });
    svg.call(zoom as any);

    // ノードの描画
    g.nodes().forEach(v => {
      const node = g.node(v) as DagreNode;

      // ノードのグループ
      const nodeGroup = svgGroup.append('g')
        .attr('class', 'cfg-node')
        .attr('transform', `translate(${node.x - node.width / 2}, ${node.y - node.height / 2})`);

      // ノードの背景
      nodeGroup.append('rect')
        .attr('width', node.width)
        .attr('height', node.height)
        .attr('rx', node.rx || 0)
        .attr('ry', node.ry || 0);

      // ノードのラベル
      nodeGroup.append('text')
        .attr('x', 10)
        .attr('y', 20)
        .attr('font-weight', 'bold')
        .text(node.label || '');

      // ノードの内容
      if (node.content) {
        const contentLines = node.content.split('\n');
        contentLines.forEach((line: string, i: number) => {
          nodeGroup.append('text')
            .attr('x', 10)
            .attr('y', 40 + i * 16)
            .attr('font-size', '12px')
            .text(line);
        });
      }
    });

    // エッジの描画
    g.edges().forEach(e => {
      const edge = g.edge(e) as DagreEdge;
      const points = edge.points;

      // パスの生成
      const line = d3.line<{x: number, y: number}>()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveBasis);

      // エッジのグループ
      const edgeGroup = svgGroup.append('g')
        .attr('class', 'cfg-edge');

      // エッジのパス
      edgeGroup.append('path')
        .attr('d', line(points) || '')
        .attr('marker-end', 'url(#arrowhead)');

      // エッジのラベル
      if (edge.label) {
        const midPoint = points[Math.floor(points.length / 2)];
        edgeGroup.append('text')
          .attr('x', midPoint.x)
          .attr('y', midPoint.y - 5)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'auto')
          .text(edge.label);
      }
    });

    // 矢印マーカーの定義
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 9)
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z');

    // 初期表示の調整
    const initialScale = 0.8;
    const svgWidth = svg.node()?.getBoundingClientRect().width || 0;
    const svgHeight = svg.node()?.getBoundingClientRect().height || 0;
    const graphWidth = g.graph().width || 0;
    const graphHeight = g.graph().height || 0;

    const initialTransform = d3.zoomIdentity
      .translate((svgWidth - graphWidth * initialScale) / 2, (svgHeight - graphHeight * initialScale) / 2)
      .scale(initialScale);

    svg.call(zoom.transform as any, initialTransform);

  }, [data]);

  return (
    <div className="cfg-viewer w-full h-[calc(100vh-200px)] min-h-[400px] border border-gray-300 rounded overflow-hidden">
      {data ? (
        <svg ref={svgRef} width="100%" height="100%"></svg>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>CFGを生成するにはLLVM IRコードを入力してください</p>
        </div>
      )}
    </div>
  );
};

export default CFGViewer;
