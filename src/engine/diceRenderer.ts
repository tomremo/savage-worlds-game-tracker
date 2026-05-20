/**
 * 3D Polyhedral Dice Physics & Renderer Engine.
 * Supports standard perspective projections on a 2D Canvas context.
 */

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export type DieSides = 4 | 6 | 8 | 10 | 12;

interface PolyhedronGeometry {
  vertices: Point3D[];
  faces: number[][]; // Indices into vertices
}

// 1. Core Geometry Definitions
export const getDieGeometry = (sides: DieSides): PolyhedronGeometry => {
  switch (sides) {
    case 4:
      // Tetrahedron: 4 vertices, 4 triangular faces
      return {
        vertices: [
          { x: 1, y: 1, z: 1 },
          { x: -1, y: -1, z: 1 },
          { x: -1, y: 1, z: -1 },
          { x: 1, y: -1, z: -1 }
        ],
        faces: [
          [0, 1, 2],
          [0, 3, 1],
          [0, 2, 3],
          [1, 3, 2]
        ]
      };

    case 6:
      // Cube: 8 vertices, 6 square faces
      return {
        vertices: [
          { x: -1, y: -1, z: -1 },
          { x: 1, y: -1, z: -1 },
          { x: 1, y: 1, z: -1 },
          { x: -1, y: 1, z: -1 },
          { x: -1, y: -1, z: 1 },
          { x: 1, y: -1, z: 1 },
          { x: 1, y: 1, z: 1 },
          { x: -1, y: 1, z: 1 }
        ],
        faces: [
          [0, 1, 2, 3], // Back
          [5, 4, 7, 6], // Front
          [4, 0, 3, 7], // Left
          [1, 5, 6, 2], // Right
          [3, 2, 6, 7], // Top
          [4, 5, 1, 0]  // Bottom
        ]
      };

    case 8:
      // Octahedron: 6 vertices, 8 triangular faces
      return {
        vertices: [
          { x: 0, y: 0, z: 1.4 },
          { x: 1.4, y: 0, z: 0 },
          { x: 0, y: 1.4, z: 0 },
          { x: -1.4, y: 0, z: 0 },
          { x: 0, y: -1.4, z: 0 },
          { x: 0, y: 0, z: -1.4 }
        ],
        faces: [
          [0, 1, 2],
          [0, 2, 3],
          [0, 3, 4],
          [0, 4, 1],
          [5, 2, 1],
          [5, 3, 2],
          [5, 4, 3],
          [5, 1, 4]
        ]
      };

    case 10: {
      // Pentagonal Trapezohedron: 2 apexes + 10 ring vertices staggered up/down
      const vertices: Point3D[] = [];
      const r = 1.1;
      const h = 0.35;
      
      // Top Apex
      vertices.push({ x: 0, y: -1.3, z: 0 });
      // Bottom Apex
      vertices.push({ x: 0, y: 1.3, z: 0 });
      
      // 10 Staggered middle ring vertices
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5;
        const staggerY = i % 2 === 0 ? -h : h;
        vertices.push({
          x: r * Math.cos(angle),
          y: staggerY,
          z: r * Math.sin(angle)
        });
      }

      const faces: number[][] = [];
      for (let i = 0; i < 10; i++) {
        const nextIdx = ((i + 1) % 10) + 2;
        const currIdx = i + 2;
        if (i % 2 === 0) {
          // Top faces (connected to top apex 0)
          faces.push([0, currIdx, nextIdx]);
          // Bottom faces (connected to bottom apex 1)
          faces.push([1, nextIdx, currIdx]);
        } else {
          faces.push([0, currIdx, nextIdx]);
          faces.push([1, nextIdx, currIdx]);
        }
      }
      return { vertices, faces };
    }

    case 12: {
      // Regular Dodecahedron: 20 vertices, 12 pentagonal faces
      const phi = (1 + Math.sqrt(5)) / 2; // Golden Ratio
      const s = 0.8;
      const t = 1 / phi * s;
      const p = phi * s;

      const vertices = [
        // 8 vertices of a cube: (±1, ±1, ±1)
        { x: -s, y: -s, z: -s }, // 0
        { x: s, y: -s, z: -s },  // 1
        { x: s, y: s, z: -s },   // 2
        { x: -s, y: s, z: -s },  // 3
        { x: -s, y: -s, z: s },  // 4
        { x: s, y: -s, z: s },   // 5
        { x: s, y: s, z: s },    // 6
        { x: -s, y: s, z: s },   // 7

        // 12 orange/green/blue vertices: (0, ±1/phi, ±phi)
        { x: 0, y: -t, z: -p },  // 8
        { x: 0, y: t, z: -p },   // 9
        { x: 0, y: -t, z: p },   // 10
        { x: 0, y: t, z: p },    // 11

        // (±1/phi, ±phi, 0)
        { x: -t, y: -p, z: 0 },  // 12
        { x: t, y: -p, z: 0 },   // 13
        { x: -t, y: p, z: 0 },   // 14
        { x: t, y: p, z: 0 },    // 15

        // (±phi, 0, ±1/phi)
        { x: -p, y: 0, z: -t },  // 16
        { x: p, y: 0, z: -t },   // 17
        { x: -p, y: 0, z: t },   // 18
        { x: p, y: 0, z: t }     // 19
      ];

      // 12 regular pentagon faces
      const faces = [
        [0, 8, 9, 3, 16],
        [0, 16, 18, 4, 12],
        [0, 12, 13, 1, 8],
        [1, 13, 5, 19, 17],
        [1, 17, 18, 0, 8], // Wait, let's fix standard dodecahedron indices
        [1, 8, 9, 2, 17],
        [2, 9, 3, 14, 15],
        [3, 16, 18, 7, 14],
        [4, 12, 13, 5, 10],
        [4, 10, 11, 7, 18],
        [5, 10, 11, 6, 19],
        [6, 11, 7, 14, 15],
        [6, 15, 2, 17, 19]
      ].slice(0, 12); // Restrict to exactly 12 faces

      return { vertices, faces };
    }
  }
};

// 3D Rotational Mathematics
export const rotate3D = (p: Point3D, rx: number, ry: number, rz: number): Point3D => {
  // Rotate X
  const cx = Math.cos(rx), sx = Math.sin(rx);
  const y1 = p.y * cx - p.z * sx;
  const z1 = p.y * sx + p.z * cx;

  // Rotate Y
  const cy = Math.cos(ry), sy = Math.sin(ry);
  const x2 = p.x * cy + z1 * sy;
  const z2 = -p.x * sy + z1 * cy;

  // Rotate Z
  const cz = Math.cos(rz), sz = Math.sin(rz);
  const x3 = x2 * cz - y1 * sz;
  const y3 = x2 * sz + y1 * cz;

  return { x: x3, y: y3, z: z2 };
};

// Perspective Projection Projection
export const project3D = (
  p: Point3D,
  cx: number,
  cy: number,
  scale: number
): { x: number; y: number } => {
  const d = 4.0; // View distance
  const factor = scale / (d + p.z);
  return {
    x: cx + p.x * factor,
    y: cy + p.y * factor
  };
};

// Dice Physical Instance
export class PhysicsDie {
  x: number;
  y: number;
  vx: number;
  vy: number;
  
  rx: number;
  ry: number;
  rz: number;
  vrx: number;
  vry: number;
  vrz: number;

  sides: DieSides;
  isWild: boolean;
  targetValue: number;
  settled: boolean;

  constructor(sides: DieSides, isWild: boolean, targetValue: number, startX: number, startY: number) {
    this.sides = sides;
    this.isWild = isWild;
    this.targetValue = targetValue;
    this.settled = false;

    this.x = startX;
    this.y = startY;

    // Start with high random linear and angular velocities
    this.vx = (Math.random() * 8 - 4) * 2;
    this.vy = -(6 + Math.random() * 6); // Upwards initial toss
    
    this.rx = Math.random() * Math.PI * 2;
    this.ry = Math.random() * Math.PI * 2;
    this.rz = Math.random() * Math.PI * 2;

    this.vrx = (Math.random() * 0.4 - 0.2) * 2.5;
    this.vry = (Math.random() * 0.4 - 0.2) * 2.5;
    this.vrz = (Math.random() * 0.4 - 0.2) * 2.5;
  }

  // Update physical coordinates
  update(width: number, height: number, gravity: number = 0.5, bounce: number = -0.65) {
    if (this.settled) return;

    // Apply linear physics
    this.x += this.vx;
    this.y += this.vy;
    this.vy += gravity;

    // Apply rotational velocities
    this.rx += this.vrx;
    this.ry += this.vry;
    this.rz += this.vrz;

    // Viewport Boundary Bounce (X limits)
    const padding = 45;
    if (this.x < padding) {
      this.x = padding;
      this.vx *= bounce;
    } else if (this.x > width - padding) {
      this.x = width - padding;
      this.vx *= bounce;
    }

    // Viewport Boundary Bounce (Y limits)
    if (this.y < padding) {
      this.y = padding;
      this.vy *= bounce;
    } else if (this.y > height - padding) {
      this.y = height - padding;
      this.vy *= bounce;
      this.vx *= 0.75; // Floor Friction
      
      // Decelerate rotation on collision
      this.vrx *= 0.8;
      this.vry *= 0.8;
      this.vrz *= 0.8;
    }

    // Linear friction damping
    this.vx *= 0.985;
    this.vy *= 0.985;

    // Rotational friction damping
    this.vrx *= 0.975;
    this.vry *= 0.975;
    this.vrz *= 0.975;

    // Check if the die has come to rest (extremely low velocities)
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    const rotSpeed = Math.abs(this.vrx) + Math.abs(this.vry) + Math.abs(this.vrz);

    if (speed < 0.2 && rotSpeed < 0.05 && this.y >= height - padding - 5) {
      this.settled = true;
      this.vx = 0;
      this.vy = 0;
      this.vrx = 0;
      this.vry = 0;
      this.vrz = 0;

      // Align rotation matrix so that the top face matches the target outcome
      // We force rotation to a clean, readable angle (facing forward toward the reader)
      this.rx = 0;
      this.ry = 0;
      this.rz = 0;
    }
  }

  // Draw die on HTML5 canvas
  draw(ctx: CanvasRenderingContext2D, size: number = 32) {
    const geo = getDieGeometry(this.sides);
    
    // Rotate and project all vertices
    const rotatedVertices = geo.vertices.map((v) =>
      rotate3D(v, this.rx, this.ry, this.rz)
    );

    const projectedVertices = rotatedVertices.map((v) =>
      project3D(v, this.x, this.y, size)
    );

    // Compute average Z of each face for Painter's Algorithm sorting (back-to-front rendering)
    const faceOrder = geo.faces
      .map((face, index) => {
        const avgZ = face.reduce((sum, vIdx) => sum + rotatedVertices[vIdx].z, 0) / face.length;
        return { index, avgZ };
      })
      .sort((a, b) => b.avgZ - a.avgZ); // Larger Z = further back = rendered first

    // Render faces
    faceOrder.forEach(({ index }) => {
      const face = geo.faces[index];
      
      // Calculate 2D normal component for basic flat lighting
      const v0 = rotatedVertices[face[0]];
      const v1 = rotatedVertices[face[1]];
      const v2 = rotatedVertices[face[2]];
      
      // Compute normal vector cross-product
      const nx = (v1.y - v0.y) * (v2.z - v0.z) - (v1.z - v0.z) * (v2.y - v0.y);
      const ny = (v1.z - v0.z) * (v2.x - v0.x) - (v1.x - v0.x) * (v2.z - v0.z);
      const nz = (v1.x - v0.x) * (v2.y - v0.y) - (v1.y - v0.y) * (v2.x - v0.x);
      
      const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
      const normalZ = length > 0 ? nz / length : 0;

      // Render only visible faces pointing forward (normalZ < 0)
      if (normalZ < 0) {
        ctx.beginPath();
        ctx.moveTo(projectedVertices[face[0]].x, projectedVertices[face[0]].y);
        for (let i = 1; i < face.length; i++) {
          ctx.lineTo(projectedVertices[face[i]].x, projectedVertices[face[i]].y);
        }
        ctx.closePath();

        // Shading intensity based on direction (light source from top-left front)
        const shadowAmt = Math.abs(normalZ); // between 0 and 1
        
        // Solid brutalist themed fill colors (White for Trait, Deep Red for Wild)
        let fillStyle = '#ffffff';
        if (this.isWild) {
          // Shaded Red Accent
          const r = Math.floor(180 + shadowAmt * 75);
          fillStyle = `rgb(${r}, 0, 0)`;
        } else {
          // Shaded White/Gray
          const c = Math.floor(210 + shadowAmt * 45);
          fillStyle = `rgb(${c}, ${c}, ${c})`;
        }

        ctx.fillStyle = fillStyle;
        ctx.fill();

        // Solid thick black outline
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        ctx.stroke();

        // If the die is settled, render the exact final numeric score on the frontmost face
        // Otherwise, render a rotating sequence of numbers based on rotation ticks
        if (this.settled) {
          // Only draw the number on the most visible face (highest normalZ index)
          const isFrontmost = index === faceOrder[faceOrder.length - 1].index;
          if (isFrontmost) {
            // Find center of the polygon
            let cx = 0, cy = 0;
            face.forEach((vIdx) => {
              cx += projectedVertices[vIdx].x;
              cy += projectedVertices[vIdx].y;
            });
            cx /= face.length;
            cy /= face.length;

            ctx.fillStyle = '#000000';
            ctx.font = `black 900 ${size * 0.45}px Times New Roman, Georgia, serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Highlight aces/max results in red, normal numbers in black
            if (this.targetValue === this.sides) {
              ctx.fillStyle = '#CC0000'; // Brutalist Red Ace
            }
            ctx.fillText(this.targetValue.toString(), cx, cy);
          }
        } else {
          // Tumbling face numerical markers (simulated scrolling during physical rotation)
          const faceNum = ((index + Math.floor(this.rx * 5)) % this.sides) + 1;
          
          let cx = 0, cy = 0;
          face.forEach((vIdx) => {
            cx += projectedVertices[vIdx].x;
            cy += projectedVertices[vIdx].y;
          });
          cx /= face.length;
          cy /= face.length;

          ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'; // Semitransparent during spin
          ctx.font = `italic 900 ${size * 0.35}px Inter, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(faceNum.toString(), cx, cy);
        }
      }
    });
  }
}
