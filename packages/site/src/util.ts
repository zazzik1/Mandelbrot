import { Position } from '@zazzik/react-mandelbrot';

export function getPositionWithAspectRatio(
    position: Position,
    width: number,
    height: number,
): Position {
    console.log('getPositionWithAspectRatio', width, height);
    return {
        ...position,
        x2: ((position.y2 - position.y1) / height) * width + position.x1,
    };
}
