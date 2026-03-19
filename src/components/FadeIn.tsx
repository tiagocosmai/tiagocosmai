import {
  Children,
  type ElementType,
  type ReactNode,
  useEffect,
  useState,
} from "react";

interface Props {
  delay?: number;
  transitionDuration?: number;
  wrapperTag?: ElementType;
  childTag?: ElementType;
  className?: string;
  childClassName?: string;
  visible?: boolean;
  onComplete?: () => void;
  children?: ReactNode;
}

export default function FadeIn({
  children,
  delay = 50,
  transitionDuration = 400,
  wrapperTag: WrapperTag = "div",
  childTag: ChildTag = "div",
  className,
  childClassName,
  visible = true,
  onComplete,
}: Props) {
  const [maxIsVisible, setMaxIsVisible] = useState(0);
  const count = Children.count(children);

  useEffect(() => {
    let target = visible ? count : 0;

    if (target === maxIsVisible) {
      const t = setTimeout(() => onComplete?.(), transitionDuration);
      return () => clearTimeout(t);
    }

    const increment = target > maxIsVisible ? 1 : -1;
    const t = setTimeout(() => setMaxIsVisible((m) => m + increment), delay);
    return () => clearTimeout(t);
  }, [
    count,
    delay,
    maxIsVisible,
    visible,
    transitionDuration,
    onComplete,
  ]);

  return (
    <WrapperTag className={className}>
      {Children.map(children, (child, i) => (
        <ChildTag
          key={i}
          className={childClassName}
          style={{
            transition: `opacity ${transitionDuration}ms, transform ${transitionDuration}ms`,
            transform: maxIsVisible > i ? "none" : "translateY(20px)",
            opacity: maxIsVisible > i ? 1 : 0,
          }}
        >
          {child}
        </ChildTag>
      ))}
    </WrapperTag>
  );
}
