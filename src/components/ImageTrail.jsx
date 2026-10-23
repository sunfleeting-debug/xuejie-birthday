import { Children, useCallback, useEffect, useMemo, useRef } from "react";
import { motion, useAnimate, useAnimationFrame } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { useMouseVector } from "../hooks/useMouseVector";

/**
 * 鼠标拖尾：光标划过的位置依次冒出一张图片，先放大再缩小消失。
 * 参考站点「noise-portfolio」的核心交互，这里换成尺K 的照片。
 *
 * 说明：轨迹项存在 ref 数组里以避免高频 setState；
 * 每次鼠标移动 useMouseVector 会触发一次重渲染，轨迹因此得以刷新。
 */
const ImageTrail = ({
  children,
  newOnTop = true,
  rotationRange = 15,
  containerRef,
  animationSequence = [
    [{ scale: 1.2 }, { duration: 0.1, ease: "circOut" }],
    [{ scale: 0 }, { duration: 0.5, ease: "circIn" }],
  ],
  interval = 100,
}) => {
  const trailRef = useRef([]);
  const lastAddedTimeRef = useRef(0);
  // position 每帧变化 —— 它既提供坐标，也负责驱动重渲染
  const { position: mousePosition } = useMouseVector(containerRef);
  const lastMousePosRef = useRef(mousePosition);
  const currentIndexRef = useRef(0);

  const childrenArray = useMemo(() => Children.toArray(children), [children]);

  const addToTrail = useCallback(
    (mousePos) => {
      const newItem = {
        id: uuidv4(),
        x: mousePos.x,
        y: mousePos.y,
        rotation: (Math.random() - 0.5) * rotationRange * 2,
        animationSequence,
        child: childrenArray[currentIndexRef.current],
      };

      currentIndexRef.current =
        (currentIndexRef.current + 1) % childrenArray.length;

      if (newOnTop) {
        trailRef.current.push(newItem);
      } else {
        trailRef.current.unshift(newItem);
      }
    },
    [childrenArray, rotationRange, animationSequence, newOnTop],
  );

  const removeFromTrail = useCallback((itemId) => {
    const index = trailRef.current.findIndex((item) => item.id === itemId);
    if (index !== -1) trailRef.current.splice(index, 1);
  }, []);

  useAnimationFrame((time) => {
    // 鼠标没动就不生成新图
    if (
      lastMousePosRef.current.x === mousePosition.x &&
      lastMousePosRef.current.y === mousePosition.y
    ) {
      return;
    }
    lastMousePosRef.current = mousePosition;

    if (time - lastAddedTimeRef.current < interval) return;
    lastAddedTimeRef.current = time;

    addToTrail(mousePosition);
  });

  return (
    <div className="relative w-full h-full pointer-events-none">
      {trailRef.current.map((item) => (
        <TrailItem key={item.id} item={item} onComplete={removeFromTrail} />
      ))}
    </div>
  );
};

const TrailItem = ({ item, onComplete }) => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const sequence = item.animationSequence.map((segment) => [
      scope.current,
      ...segment,
    ]);
    animate(sequence).then(() => onComplete(item.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      ref={scope}
      className="absolute"
      style={{ left: item.x, top: item.y, rotate: item.rotation }}
    >
      {item.child}
    </motion.div>
  );
};

export { ImageTrail };
