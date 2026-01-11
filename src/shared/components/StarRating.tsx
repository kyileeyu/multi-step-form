import styled from "@emotion/styled";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  precision?: 0.5 | 1;
  max?: number;
}

export const StarRating = ({
  value = 0,
  onChange,
  precision = 0.5,
  max = 5,
}: StarRatingProps) => {
  const handleClick = (index: number, isHalf: boolean) => {
    const newValue = isHalf && precision === 0.5 ? index + 0.5 : index + 1;
    onChange(newValue);
  };

  return (
    <Container>
      {Array.from({ length: max }, (_, index) => {
        const filled = value >= index + 1;
        const halfFilled = value >= index + 0.5 && value < index + 1;

        return (
          <StarWrapper key={index}>
            {precision === 0.5 && (
              <HalfClickArea
                position="left"
                onClick={() => handleClick(index, true)}
              />
            )}
            <HalfClickArea
              position="right"
              onClick={() => handleClick(index, false)}
            />
            <Star filled={filled}>★</Star>
            {halfFilled && <HalfStar>★</HalfStar>}
          </StarWrapper>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: 4px;
`;

const StarWrapper = styled.div`
  position: relative;
  cursor: pointer;
  font-size: 32px;
  line-height: 1;
`;

const HalfClickArea = styled.div<{ position: "left" | "right" }>`
  position: absolute;
  top: 0;
  ${({ position }) => position}: 0;
  width: 50%;
  height: 100%;
  z-index: 1;
`;

const Star = styled.span<{ filled: boolean }>`
  color: ${({ filled }) => (filled ? "#faaf00" : "#e0e0e0")};
  transition: color 0.15s;
`;

const HalfStar = styled.span`
  position: absolute;
  left: 0;
  top: 0;
  width: 50%;
  overflow: hidden;
  color: #faaf00;
`;
