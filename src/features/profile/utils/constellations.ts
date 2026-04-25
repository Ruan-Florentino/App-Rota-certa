export interface StarNode {
  x: number; // 0 to 1
  y: number; // 0 to 1
  id: string;
}

export function generateConstellationNodes(count: number): StarNode[] {
  const nodes: StarNode[] = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: Math.random(),
      y: Math.random(),
      id: `star-${i}`
    });
  }
  return nodes;
}
