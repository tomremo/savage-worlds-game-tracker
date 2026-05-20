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
          [2, 1, 0],
          [1, 3, 0],
          [3, 2, 0],
          [2, 3, 1]
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
          [3, 2, 1, 0], // Back
          [6, 7, 4, 5], // Front
          [7, 3, 0, 4], // Left
          [2, 6, 5, 1], // Right
          [7, 6, 2, 3], // Top
          [0, 1, 5, 4]  // Bottom
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
      // Mathematically precise Pentagonal Trapezohedron (100% planar kite faces)
      const vertices: Point3D[] = [];
      const r = 1.1;
      const b = 1.3; // Apex height
      
      // Calculate the exact stagger height 'h' to guarantee perfect planarity
      const cos36 = Math.cos(Math.PI / 5);
      const h = b * (1 - cos36) / (1 + cos36); // ~0.1372
      
      // Top Apex
      vertices.push({ x: 0, y: -b, z: 0 }); // 0
      // Bottom Apex
      vertices.push({ x: 0, y: b, z: 0 });  // 1
      
      // 10 Staggered middle ring vertices (even = upper ring, odd = lower ring)
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5;
        const staggerY = i % 2 === 0 ? -h : h;
        vertices.push({
          x: r * Math.cos(angle),
          y: staggerY,
          z: r * Math.sin(angle)
        });
      }

      // 10 congruent, coplanar, outward-wound kite faces
      const faces: number[][] = [];
      for (let k = 0; k < 5; k++) {
        const T_k = 2 * k + 2;
        const B_k = 2 * k + 3;
        const T_next = 2 * ((k + 1) % 5) + 2;
        const B_next = 2 * ((k + 1) % 5) + 3;

        // Top half faces (connected to top apex 0)
        faces.push([0, T_k, B_k, T_next]);

        // Bottom half faces (connected to bottom apex 1)
        faces.push([1, B_next, T_next, B_k]);
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

      // 12 regular pentagon faces with correct outward-pointing winding order
      const faces = [
        [0, 8, 1, 13, 12],
        [16, 3, 9, 8, 0],
        [0, 12, 4, 18, 16],
        [1, 8, 9, 2, 17],
        [17, 19, 5, 13, 1],
        [2, 9, 3, 14, 15],
        [2, 15, 6, 19, 17],
        [16, 18, 7, 14, 3],
        [12, 13, 5, 10, 4],
        [4, 10, 11, 7, 18],
        [19, 6, 11, 10, 5],
        [15, 14, 7, 11, 6]
      ];

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

// Perspective Projection
export const project3D = (
  p: Point3D,
  cx: number,
  cy: number,
  scale: number
): { x: number; y: number } => {
  const d = 15.0; // Flat, realistic telephoto perspective to eliminate rotational distortion
  const factor = scale / (1 + p.z / d);
  return {
    x: cx + p.x * factor,
    y: cy + p.y * factor
  };
};

// Centralized settings configuration for the 3D dice physics and rendering engine
export const DICE_CONFIG = {
  size: 65,               // Scale size of the dice (increased for high impact)
  gravity: 0.16,          // Gentler Z gravity into the table for floating 3D feel
  bounce: -0.90,          // Highly elastic bounciness coefficient
  linearDamping: 0.996,   // Extremely slow linear decay so they slide twice as long
  rotationalDamping: 0.992,// Extremely slow rotational decay so they spin twice as long
  duration: 7000,         // Double settling window to 7 seconds
};

// Dice Physical Instance
export class PhysicsDie {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  
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
  isAligning: boolean = false; // Smooth transition alignment phase

  // Maps face indices in geometry to fixed face numbers from 1 to sides
  faceNumbers: { [faceIndex: number]: number } = {};

  // History buffer for drawing motion trails (speed lines)
  history: Point3D[] = [];

  constructor(sides: DieSides, isWild: boolean, targetValue: number, startX: number, startY: number) {
    this.sides = sides;
    this.isWild = isWild;
    this.targetValue = targetValue;
    this.settled = false;

    this.x = startX;
    this.y = startY;
    this.z = Math.random() * 20 - 30; // Start closer to the camera/screen

    // Thrown extremely energetically in all directions across the entire window tabletop
    this.vx = (Math.random() * 12 - 6) * 2.5;
    this.vy = (Math.random() * 12 - 6) * 2.5; // Balanced tabletop sliding velocity
    this.vz = -(10 + Math.random() * 8);      // Upward toss in Z direction (towards camera)
    
    this.rx = Math.random() * Math.PI * 2;
    this.ry = Math.random() * Math.PI * 2;
    this.rz = Math.random() * Math.PI * 2;

    this.vrx = (Math.random() * 0.5 - 0.25) * 3;
    this.vry = (Math.random() * 0.5 - 0.25) * 3;
    this.vrz = (Math.random() * 0.5 - 0.25) * 3;

    // Pre-calculate locked numbers on the faces
    this.initializeFaceNumbers();
  }

  // Maps numbers 1 to sides to specific faces so they rotate realistically
  initializeFaceNumbers() {
    const geo = getDieGeometry(this.sides);

    // 1. Calculate normal Z for each face at zero rotation (rest alignment)
    const faceNormals = geo.faces.map((face, index) => {
      const v0 = geo.vertices[face[0]];
      const v1 = geo.vertices[face[1]];
      const v2 = geo.vertices[face[2]];
      
      const nx = (v1.y - v0.y) * (v2.z - v0.z) - (v1.z - v0.z) * (v2.y - v0.y);
      const ny = (v1.z - v0.z) * (v2.x - v0.x) - (v1.x - v0.x) * (v2.z - v0.z);
      const nz = (v1.x - v0.x) * (v2.y - v0.y) - (v1.y - v0.y) * (v2.x - v0.x);
      
      const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
      const normalZ = length > 0 ? nz / length : 0;
      return { index, normalZ };
    });

    // 2. Find frontmost face index (most negative normalZ) at zero rotation
    faceNormals.sort((a, b) => a.normalZ - b.normalZ);
    const frontmostFaceIndex = faceNormals[0].index;

    // 3. Assign targetValue to this frontmost face
    this.faceNumbers[frontmostFaceIndex] = this.targetValue;

    // 4. Distribute the remaining numbers sequentially to the other faces
    const availableNumbers = Array.from({ length: this.sides }, (_, i) => i + 1)
      .filter((n) => n !== this.targetValue);

    let numberIdx = 0;
    geo.faces.forEach((_, index) => {
      if (index !== frontmostFaceIndex) {
        this.faceNumbers[index] = availableNumbers[numberIdx++] || 1;
      }
    });
  }

  // Applies angular contact impulse at a vertex collision point
  applyImpulse(r: Point3D, normal: Point3D, bounce: number): boolean {
    // 1. Calculate relative velocity of the vertex: V_vertex = V_center + W x R
    const v_rot = {
      x: this.vry * r.z - this.vrz * r.y,
      y: this.vrz * r.x - this.vrx * r.z,
      z: this.vrx * r.y - this.vry * r.x
    };
    
    const v_vertex = {
      x: this.vx + v_rot.x,
      y: this.vy + v_rot.y,
      z: this.vz + v_rot.z
    };
    
    // 2. Compute relative normal velocity
    const v_rel = v_vertex.x * normal.x + v_vertex.y * normal.y + v_vertex.z * normal.z;
    
    // Only bounce if moving into the boundary
    if (v_rel >= 0) return false;
    
    // 3. Calculate rotational torque factor: R x N
    const rxn = {
      x: r.y * normal.z - r.z * normal.y,
      y: r.z * normal.x - r.x * normal.z,
      z: r.x * normal.y - r.y * normal.x
    };
    
    const rxn_sq = rxn.x * rxn.x + rxn.y * rxn.y + rxn.z * rxn.z;
    
    const M = 1.0;
    const size = DICE_CONFIG.size;
    const I = 0.42 * M * (size * 0.85) * (size * 0.85); // Solid plastic moment coefficient scaled to pixels
    
    const impulse = -(1 + bounce) * v_rel / (1 / M + rxn_sq / I);
    
    // 4. Apply impulse to velocities
    this.vx += (impulse * normal.x) / M;
    this.vy += (impulse * normal.y) / M;
    this.vz += (impulse * normal.z) / M;
    
    // 5. Apply torque impulse to spin values
    this.vrx += (impulse * rxn.x) / I;
    this.vry += (impulse * rxn.y) / I;
    this.vrz += (impulse * rxn.z) / I;
    
    return true;
  }

  // Performs vertex-precise boundary checks and shifts centers to resolve overlap
  checkBoundaryCollisions(
    width: number, 
    height: number, 
    bounce: number,
    onCollision?: (type: 'bounce', speed: number) => void
  ) {
    const geo = getDieGeometry(this.sides);
    const size = DICE_CONFIG.size;
    const rotated = geo.vertices.map((v) => rotate3D(v, this.rx, this.ry, this.rz));
    
    let collided = false;
    let maxVel = 0;
    
    // Check contact boundary for all 3D vertices
    rotated.forEach((r) => {
      const rx_px = r.x * size * 0.85;
      const ry_px = r.y * size * 0.85;
      const rz_px = r.z * size * 0.85;
      
      const px = this.x + rx_px;
      const py = this.y + ry_px;
      const pz = this.z + rz_px;
      
      // Bottom wall
      if (py > height) {
        const pen = py - height;
        this.y -= pen;
        const contact = { x: rx_px, y: ry_px, z: rz_px };
        if (this.applyImpulse(contact, { x: 0, y: -1, z: 0 }, bounce)) {
          collided = true;
          const speed = Math.abs(this.vy);
          if (speed > maxVel) maxVel = speed;
        }
      }
      
      // Top wall
      if (py < 0) {
        const pen = 0 - py;
        this.y += pen;
        const contact = { x: rx_px, y: ry_px, z: rz_px };
        if (this.applyImpulse(contact, { x: 0, y: 1, z: 0 }, bounce)) {
          collided = true;
          const speed = Math.abs(this.vy);
          if (speed > maxVel) maxVel = speed;
        }
      }
      
      // Left wall
      if (px < 0) {
        const pen = 0 - px;
        this.x += pen;
        const contact = { x: rx_px, y: ry_px, z: rz_px };
        if (this.applyImpulse(contact, { x: 1, y: 0, z: 0 }, bounce)) {
          collided = true;
          const speed = Math.abs(this.vx);
          if (speed > maxVel) maxVel = speed;
        }
      }
      
      // Right wall
      if (px > width) {
        const pen = px - width;
        this.x -= pen;
        const contact = { x: rx_px, y: ry_px, z: rz_px };
        if (this.applyImpulse(contact, { x: -1, y: 0, z: 0 }, bounce)) {
          collided = true;
          const speed = Math.abs(this.vx);
          if (speed > maxVel) maxVel = speed;
        }
      }
      
      // Tabletop surface at the back (positive Z)
      if (pz > 40) {
        const pen = pz - 40;
        this.z -= pen;
        const contact = { x: rx_px, y: ry_px, z: rz_px };
        if (this.applyImpulse(contact, { x: 0, y: 0, z: -1 }, bounce)) {
          collided = true;
          const speed = Math.abs(this.vz);
          if (speed > maxVel) maxVel = speed;
        }
      }
      
      // Front glass ceiling limits (negative Z)
      if (pz < -40) {
        const pen = -40 - pz;
        this.z += pen;
        const contact = { x: rx_px, y: ry_px, z: rz_px };
        if (this.applyImpulse(contact, { x: 0, y: 0, z: 1 }, bounce)) {
          collided = true;
          const speed = Math.abs(this.vz);
          if (speed > maxVel) maxVel = speed;
        }
      }
    });

    if (collided && onCollision && maxVel > 0.4) {
      onCollision('bounce', maxVel);
    }
  }

  // Performs sphere-to-sphere elastic collision checking and momentum transfers
  checkDieToDieCollision(
    other: PhysicsDie, 
    onCollision?: (type: 'die_collision', speed: number) => void
  ) {
    if (this.settled && other.settled) return;
    
    // 3D vector separation
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    const dz = other.z - this.z;
    
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const radius = DICE_CONFIG.size * 0.48;
    const minDist = radius * 2;
    
    if (dist < minDist && dist > 0.001) {
      // Resolve overlapping penetration
      const pen = minDist - dist;
      const nx = dx / dist;
      const ny = dy / dist;
      const nz = dz / dist;
      
      const shiftX = nx * pen * 0.5;
      const shiftY = ny * pen * 0.5;
      const shiftZ = nz * pen * 0.5;
      
      if (!this.settled) {
        this.x -= shiftX;
        this.y -= shiftY;
        this.z -= shiftZ;
      }
      if (!other.settled) {
        other.x += shiftX;
        other.y += shiftY;
        other.z += shiftZ;
      }
      
      // Relative velocity in collision vector direction
      const rvx = other.vx - this.vx;
      const rvy = other.vy - this.vy;
      const rvz = other.vz - this.vz;
      
      const v_rel = rvx * nx + rvy * ny + rvz * nz;
      
      // Only resolve if moving towards each other
      if (v_rel < 0) {
        const e = 0.55; // resin elastic bounce
        const j = -(1 + e) * v_rel / 2.0; // equal masses
        
        if (!this.settled) {
          this.vx -= j * nx;
          this.vy -= j * ny;
          this.vz -= j * nz;
          // minor random spin offset
          this.vrx -= (Math.random() * 0.08 - 0.04);
          this.vry -= (Math.random() * 0.08 - 0.04);
          this.vrz -= (Math.random() * 0.08 - 0.04);
        }
        
        if (!other.settled) {
          other.vx += j * nx;
          other.vy += j * ny;
          other.vz += j * nz;
          other.vrx += (Math.random() * 0.08 - 0.04);
          other.vry += (Math.random() * 0.08 - 0.04);
          other.vrz += (Math.random() * 0.08 - 0.04);
        }
        
        // Solid elastic collision momentum resolution without sparks
        
        if (onCollision && Math.abs(v_rel) > 0.35) {
          onCollision('die_collision', Math.abs(v_rel));
        }
      }
    }
  }

  // Update physical coordinates
  update(
    width: number, 
    height: number, 
    onCollision?: (type: 'bounce' | 'die_collision', speed: number) => void
  ) {
    if (this.settled) return;

    // Wrap helper for target angle interpolation to prevent "long way around" spinning
    const wrapAngle = (angle: number): number => {
      let a = angle % (Math.PI * 2);
      if (a > Math.PI) a -= Math.PI * 2;
      if (a < -Math.PI) a += Math.PI * 2;
      return a;
    };

    // Smooth resting alignment phase to prevent sudden snapping/jittering
    if (this.isAligning) {
      this.rx = wrapAngle(this.rx);
      this.ry = wrapAngle(this.ry);
      this.rz = wrapAngle(this.rz);

      this.rx += (0 - this.rx) * 0.15;
      this.ry += (0 - this.ry) * 0.15;
      this.rz += (0 - this.rz) * 0.15;
      this.z += (0 - this.z) * 0.15;

      if (
        Math.abs(this.rx) < 0.01 &&
        Math.abs(this.ry) < 0.01 &&
        Math.abs(this.rz) < 0.01 &&
        Math.abs(this.z) < 0.1
      ) {
        this.settled = true;
        this.isAligning = false;
        this.rx = 0;
        this.ry = 0;
        this.rz = 0;
        this.z = 0;
      }
      return;
    }

    // Save trailing history for motion trail lines
    this.history.push({ x: this.x, y: this.y, z: this.z });
    if (this.history.length > 4) {
      this.history.shift();
    }

    // Apply linear gravity in Z (pulls the dice down onto the tabletop at positive Z depth)
    this.vz += DICE_CONFIG.gravity;

    // Update positions
    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;

    // Update rotational orientations
    this.rx += this.vrx;
    this.ry += this.vry;
    this.rz += this.vrz;

    // Boundary Bounces (vertex exact)
    this.checkBoundaryCollisions(width, height, -DICE_CONFIG.bounce, onCollision);

    // Friction Damping decay
    this.vx *= DICE_CONFIG.linearDamping;
    this.vy *= DICE_CONFIG.linearDamping;
    this.vz *= DICE_CONFIG.linearDamping;

    this.vrx *= DICE_CONFIG.rotationalDamping;
    this.vry *= DICE_CONFIG.rotationalDamping;
    this.vrz *= DICE_CONFIG.rotationalDamping;

    // Check if the die has come to rest (extremely low velocities)
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy + this.vz * this.vz);
    const rotSpeed = Math.abs(this.vrx) + Math.abs(this.vry) + Math.abs(this.vrz);

    // Check table surface contact at positive Z depth
    const geo = getDieGeometry(this.sides);
    const size = DICE_CONFIG.size;
    let highestZ = -Infinity;
    geo.vertices.forEach((v) => {
      const r = rotate3D(v, this.rx, this.ry, this.rz);
      const pz = this.z + r.z * size * 0.85;
      if (pz > highestZ) highestZ = pz;
    });

    if (speed < 0.22 && rotSpeed < 0.05 && highestZ >= 40 - 12) {
      this.isAligning = true;
      this.vx = 0;
      this.vy = 0;
      this.vz = 0;
      this.vrx = 0;
      this.vry = 0;
      this.vrz = 0;
    }
  }

  // Draw die on HTML5 canvas
  draw(ctx: CanvasRenderingContext2D, size: number = DICE_CONFIG.size) {
    const geo = getDieGeometry(this.sides);
    
    // Rotate all vertices
    const rotatedVertices = geo.vertices.map((v) =>
      rotate3D(v, this.rx, this.ry, this.rz)
    );

    // Project all vertices using the die's center depth for uniform scaling to completely eliminate rotational shape distortion
    const projectedVertices = rotatedVertices.map((v) =>
      project3D({ x: v.x, y: v.y, z: this.z / size }, this.x, this.y, size)
    );

    // Painter's Algorithm sorting (back-to-front rendering)
    const faceOrder = geo.faces
      .map((face, index) => {
        const avgZ = face.reduce((sum, vIdx) => sum + rotatedVertices[vIdx].z, 0) / face.length;
        return { index, avgZ };
      })
      .sort((a, b) => b.avgZ - a.avgZ);

    // Draw comic speed trails from historical buffers
    this.history.forEach((hist, index) => {
      const opacity = ((index + 1) / (this.history.length + 1)) * 0.14;
      if (opacity <= 0) return;
      
      ctx.beginPath();
      const rotatedH = geo.vertices.map((v) => rotate3D(v, this.rx, this.ry, this.rz));
      const projectedH = rotatedH.map((v) =>
        project3D({ x: v.x, y: v.y, z: hist.z / size }, hist.x, hist.y, size)
      );

      faceOrder.forEach(({ index: fIdx }) => {
        const face = geo.faces[fIdx];
        const v0 = rotatedH[face[0]];
        const v1 = rotatedH[face[1]];
        const v2 = rotatedH[face[2]];
        
        const nx = (v1.y - v0.y) * (v2.z - v0.z) - (v1.z - v0.z) * (v2.y - v0.y);
        const ny = (v1.z - v0.z) * (v2.x - v0.x) - (v1.x - v0.x) * (v2.z - v0.z);
        const nz = (v1.x - v0.x) * (v2.y - v0.y) - (v1.y - v0.y) * (v2.x - v0.x);
        
        const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
        const normalZ = length > 0 ? nz / length : 0;
        
        if (normalZ < 0) {
          ctx.moveTo(projectedH[face[0]].x, projectedH[face[0]].y);
          for (let i = 1; i < face.length; i++) {
            ctx.lineTo(projectedH[face[i]].x, projectedH[face[i]].y);
          }
        }
      });
      
      ctx.strokeStyle = this.isWild ? `rgba(180, 0, 0, ${opacity})` : `rgba(0, 0, 0, ${opacity})`;
      ctx.lineWidth = 1.8;
      ctx.stroke();
    });

    // Pass 1: Draw bold outer silhouette outline
    ctx.beginPath();
    faceOrder.forEach(({ index }) => {
      const face = geo.faces[index];
      const v0 = rotatedVertices[face[0]];
      const v1 = rotatedVertices[face[1]];
      const v2 = rotatedVertices[face[2]];
      
      const nx = (v1.y - v0.y) * (v2.z - v0.z) - (v1.z - v0.z) * (v2.y - v0.y);
      const ny = (v1.z - v0.z) * (v2.x - v0.x) - (v1.x - v0.x) * (v2.z - v0.z);
      const nz = (v1.x - v0.x) * (v2.y - v0.y) - (v1.y - v0.y) * (v2.x - v0.x);
      
      const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
      const normalZ = length > 0 ? nz / length : 0;

      if (normalZ < 0) {
        ctx.moveTo(projectedVertices[face[0]].x, projectedVertices[face[0]].y);
        for (let i = 1; i < face.length; i++) {
          ctx.lineTo(projectedVertices[face[i]].x, projectedVertices[face[i]].y);
        }
      }
    });
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 6.0; // bold cartoon border
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Pass 2: Draw visible shaded faces
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

        // Discretized comic book cell shading
        const shadowAmt = Math.abs(normalZ);
        let cellShadow = 0.5;
        if (shadowAmt > 0.82) {
          cellShadow = 1.0;
        } else if (shadowAmt > 0.45) {
          cellShadow = 0.75;
        } else {
          cellShadow = 0.45;
        }
        
        let fillStyle = '#ffffff';
        if (this.isWild) {
          const r = Math.floor(140 + cellShadow * 115);
          fillStyle = `rgb(${r}, 0, 0)`;
        } else {
          const c = Math.floor(180 + cellShadow * 75);
          fillStyle = `rgb(${c}, ${c}, ${c})`;
        }

        ctx.fillStyle = fillStyle;
        ctx.fill();

        // Draw inner outlines (thin outlines for face boundaries)
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.8;
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Draw numbers physically locked to each face (spin & settled states)
        const faceNum = this.faceNumbers[index];
        if (faceNum !== undefined) {
          // Find center coordinates of the polygon face
          let cx = 0, cy = 0;
          face.forEach((vIdx) => {
            cx += projectedVertices[vIdx].x;
            cy += projectedVertices[vIdx].y;
          });
          cx /= face.length;
          cy /= face.length;

          ctx.fillStyle = '#000000';
          
          // Compute dynamic perspective factor to scale the face numbers to the exact size of the die at its current depth
          const d = 15.0;
          const currentFactor = size / (1 + (this.z / size) / d);

          if (this.settled) {
            // Draw only on frontmost face when settled for maximum readability
            const isFrontmost = index === faceOrder[faceOrder.length - 1].index;
            if (isFrontmost) {
              ctx.font = `black 900 ${currentFactor * 0.45}px Times New Roman, Georgia, serif`;
              if (faceNum === this.sides) {
                ctx.fillStyle = '#CC0000'; // Brutalist Red Ace
              }
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(faceNum.toString(), cx, cy);
            }
          } else {
            // Always show numbers on faces during rotation, fully synced to 3D movement and depth scaling
            ctx.font = `black 900 ${currentFactor * 0.38}px Times New Roman, Georgia, serif`;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.75)'; // High-contrast opacity
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(faceNum.toString(), cx, cy);
          }
        }
      }
    });
  }
}

