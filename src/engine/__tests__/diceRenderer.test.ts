import { describe, it, expect } from 'vitest';
import { getDieGeometry, rotate3D, project3D, PhysicsDie, DieSides } from '../diceRenderer';

describe('3D Dice Renderer & Physics Engine', () => {
  describe('getDieGeometry', () => {
    it('should return correct vertices and faces counts for each polyhedral shape', () => {
      // d4 (Tetrahedron)
      const d4 = getDieGeometry(4);
      expect(d4.vertices.length).toBe(4);
      expect(d4.faces.length).toBe(4);
      d4.faces.forEach(f => expect(f.length).toBe(3)); // All triangular

      // d6 (Cube)
      const d6 = getDieGeometry(6);
      expect(d6.vertices.length).toBe(8);
      expect(d6.faces.length).toBe(6);
      d6.faces.forEach(f => expect(f.length).toBe(4)); // All square/quad

      // d8 (Octahedron)
      const d8 = getDieGeometry(8);
      expect(d8.vertices.length).toBe(6);
      expect(d8.faces.length).toBe(8);
      d8.faces.forEach(f => expect(f.length).toBe(3)); // All triangular

      // d10 (Pentagonal Trapezohedron)
      const d10 = getDieGeometry(10);
      expect(d10.vertices.length).toBe(12);
      expect(d10.faces.length).toBe(20);
      d10.faces.forEach(f => expect(f.length).toBe(3)); // Staggered apex triangular subdivision

      // d12 (Regular Dodecahedron)
      const d12 = getDieGeometry(12);
      expect(d12.vertices.length).toBe(20);
      expect(d12.faces.length).toBe(12);
      d12.faces.forEach(f => expect(f.length).toBe(5)); // All pentagonal
    });
  });

  describe('rotate3D', () => {
    it('should leave a point unchanged under zero rotation', () => {
      const p = { x: 1, y: 2, z: 3 };
      const rotated = rotate3D(p, 0, 0, 0);
      expect(rotated.x).toBeCloseTo(p.x);
      expect(rotated.y).toBeCloseTo(p.y);
      expect(rotated.z).toBeCloseTo(p.z);
    });

    it('should correctly rotate a point around principal axes', () => {
      // Rotate 90 degrees (pi/2) around Z axis
      const p = { x: 1, y: 0, z: 0 };
      const rotatedZ = rotate3D(p, 0, 0, Math.PI / 2);
      expect(rotatedZ.x).toBeCloseTo(0);
      expect(rotatedZ.y).toBeCloseTo(1);
      expect(rotatedZ.z).toBeCloseTo(0);
    });
  });

  describe('project3D', () => {
    it('should project a 3D coordinate to 2D using perspective equations', () => {
      const p1 = { x: 1, y: 1, z: 0 };
      const p2 = { x: 1, y: 1, z: 1.0 }; // Further away in positive Z depth

      const proj1 = project3D(p1, 100, 100, 50);
      const proj2 = project3D(p2, 100, 100, 50);

      // Distance factor formula is scale / (d + z) where d = 4.0.
      // For p1: factor = 50 / (4.0 + 0) = 12.5. x = 100 + 1 * 12.5 = 112.5.
      expect(proj1.x).toBeCloseTo(112.5);
      expect(proj1.y).toBeCloseTo(112.5);

      // For p2: factor = 50 / (4.0 + 1.0) = 10.0. x = 100 + 1 * 10 = 110.
      // Higher Z (further back) must project closer to center (smaller scale factor)
      expect(proj2.x).toBe(110);
      expect(proj2.y).toBe(110);
    });
  });

  describe('PhysicsDie', () => {
    it('should initialize with starting positions and velocities', () => {
      const die = new PhysicsDie(6, false, 5, 150, 80);
      expect(die.sides).toBe(6);
      expect(die.isWild).toBe(false);
      expect(die.targetValue).toBe(5);
      expect(die.x).toBe(150);
      expect(die.y).toBe(80);
      expect(die.settled).toBe(false);
      expect(Math.abs(die.vy)).toBeGreaterThan(0);
    });

    it('should assign physically mapped face numbers correctly', () => {
      const sidesList: DieSides[] = [4, 6, 8, 10, 12];
      
      sidesList.forEach(sides => {
        const targetValue = Math.floor(Math.random() * sides) + 1;
        const die = new PhysicsDie(sides, false, targetValue, 100, 100);
        
        // Assert faceNumbers exists and has correct number of elements matching the faces count in geometry
        const geometry = getDieGeometry(sides);
        const expectedFaceCount = geometry.faces.length;
        
        expect(Object.keys(die.faceNumbers).length).toBe(expectedFaceCount);
        
        // Assert targetValue is mapped to one of the faces
        const mappedValues = Object.values(die.faceNumbers);
        expect(mappedValues).toContain(targetValue);
        
        // Assert that every value is between 1 and sides
        mappedValues.forEach(val => {
          expect(val).toBeGreaterThanOrEqual(1);
          expect(val).toBeLessThanOrEqual(sides);
        });

        // Assert all face numbers (1 to sides) are assigned without duplicates (if applicable for shapes where faces matches sides)
        if (expectedFaceCount === sides) {
          const uniqueValues = new Set(mappedValues);
          expect(uniqueValues.size).toBe(sides);
        }
      });
    });

    it('should update physical coordinates and damp velocity over time', () => {
      const die = new PhysicsDie(8, true, 4, 150, 80);

      die.update(300, 200);

      // Coordinates should change
      expect(die.x).not.toBe(150);
      expect(die.y).not.toBe(80);

      // Running updates repeatedly should reduce velocities (due to friction damping)
      for (let i = 0; i < 500; i++) {
        die.update(300, 200);
      }

      // Check that it eventually settles
      expect(die.settled).toBe(true);
      expect(die.vx).toBe(0);
      expect(die.vy).toBe(0);
      expect(die.rx).toBe(0);
      expect(die.ry).toBe(0);
      expect(die.rz).toBe(0);
    });

    it('should trigger boundary collision callback when hitting bottom floor', () => {
      const die = new PhysicsDie(6, false, 3, 100, 195);
      // Ensure deterministic pure vertical drop without random rotational influences interfering with collision detection
      die.rx = 0;
      die.ry = 0;
      die.rz = 0;
      die.vrx = 0;
      die.vry = 0;
      die.vrz = 0;
      die.vy = 5; // moving downwards towards bottom floor (height = 200)

      let callbackTriggered = false;
      let callbackType = '';
      die.update(200, 200, (type) => {
        callbackTriggered = true;
        callbackType = type;
      });

      expect(callbackTriggered).toBe(true);
      expect(callbackType).toBe('bounce');
    });
  });
});
