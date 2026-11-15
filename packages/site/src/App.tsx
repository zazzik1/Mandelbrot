import {
    Box,
    Button,
    Color,
    ColorPicker,
    Field,
    Heading,
    HStack,
    NumberInput,
    parseColor,
    Portal,
    Select,
    Slider,
    Stack,
    Switch,
} from '@chakra-ui/react';
import { Mandelbrot, MandelbrotRef, Position } from '@zazzik/react-mandelbrot';
import { useCallback, useMemo, useRef, useState } from 'react';
import { HiCheck, HiX } from 'react-icons/hi';
import {
    CANVAS_SIZES,
    CanvasSizeKey,
    canvasSizes,
    ColorPaletteKey,
    colorPalettes,
    DEFAULT_CONVERGED_COLOR,
    DEFAULT_ITERATIONS,
    DEFAULT_POSITION,
    DEFAULT_POSITION_JULIA,
    getCanvasSize,
    RGB_PALETTES,
} from '@/constants/constants';
import GitHubButton from '@/GithubButton';
import { getPositionWithAspectRatio } from '@/util';

type ValueChangeDetails = { value: string; valueAsNumber: number };

function App() {
    // check window width only on init
    const DEFAULT_CANVAS_SIZE_KEY: CanvasSizeKey = useMemo(
        () => (window.innerWidth < 600 ? '360x640' : 'Fullscreen'),
        [],
    );
    const mandelbrotRef = useRef<MandelbrotRef>(null);
    const juliaRef = useRef<MandelbrotRef>(null);
    const [position, setPosition] = useState<Position>(
        getPositionWithAspectRatio(
            DEFAULT_POSITION,
            getCanvasSize(DEFAULT_CANVAS_SIZE_KEY, true).width,
            getCanvasSize(DEFAULT_CANVAS_SIZE_KEY, true).height,
        ),
    );
    const [positionJulia, setPositionJulia] = useState<Position>(
        getPositionWithAspectRatio(
            DEFAULT_POSITION_JULIA,
            getCanvasSize(DEFAULT_CANVAS_SIZE_KEY, true).width,
            getCanvasSize(DEFAULT_CANVAS_SIZE_KEY, true).height,
        ),
    );
    const [iterations, setIterations] = useState<number>(DEFAULT_ITERATIONS);
    const [mouseWheelEnabled, setMouseWheelEnabled] = useState(true);
    const [canvasSize, setCanvasSize] = useState<CanvasSizeKey>(DEFAULT_CANVAS_SIZE_KEY);
    const [colorPaletteKey, setColorPalette] = useState<ColorPaletteKey>('PALETTE_3');
    const [colorOffset, setColorOffset] = useState<number>(26);
    const [convergedColor, setConvergedColor] = useState(parseColor(DEFAULT_CONVERGED_COLOR));
    const [juliaEnabled, setJuliaEnabled] = useState(true);

    const colorPalette = RGB_PALETTES[colorPaletteKey as ColorPaletteKey];
    const { width, height } = useMemo(() => {
        return getCanvasSize(canvasSize as CanvasSizeKey, juliaEnabled);
    }, [canvasSize, juliaEnabled]);

    const handleResetSettings = useCallback(() => {
        const juliaEnabled = true;
        setPosition(
            getPositionWithAspectRatio(
                DEFAULT_POSITION,
                getCanvasSize(DEFAULT_CANVAS_SIZE_KEY, juliaEnabled).width,
                getCanvasSize(DEFAULT_CANVAS_SIZE_KEY, juliaEnabled).height,
            ),
        );
        setPositionJulia(
            getPositionWithAspectRatio(
                DEFAULT_POSITION_JULIA,
                getCanvasSize(DEFAULT_CANVAS_SIZE_KEY, juliaEnabled).width,
                getCanvasSize(DEFAULT_CANVAS_SIZE_KEY, juliaEnabled).height,
            ),
        );
        setIterations(DEFAULT_ITERATIONS);
        setColorOffset(26);
        setConvergedColor(parseColor(DEFAULT_CONVERGED_COLOR));
        setColorPalette('PALETTE_3');
        setMouseWheelEnabled(true);
        setCanvasSize(DEFAULT_CANVAS_SIZE_KEY);
        setJuliaEnabled(juliaEnabled);
    }, [DEFAULT_CANVAS_SIZE_KEY]);

    const handleDownloadImage = useCallback(() => {
        mandelbrotRef.current?.downloadImage();
    }, []);

    const handleZoom = useCallback((zoom: number) => {
        mandelbrotRef.current?.click(0.5, 0.5, zoom);
    }, []);

    const convergedColorHex = useMemo(() => convergedColor.toString('hex'), [convergedColor]);
    return (
        <>
            <Stack
                backgroundColor="rgba(7, 3, 22, 0.4)"
                backdropFilter="blur(12px)"
                zIndex={2}
                position="absolute"
                left="24px"
                top="24px"
                width="calc(100% - 48px)"
                padding="24px"
                borderRadius="12px"
            >
                <HStack
                    justifyContent="space-between"
                    flexWrap="wrap"
                >
                    <Heading size="2xl">Mandelbrot fractal generator</Heading>
                    <GitHubButton />
                </HStack>
                <HStack
                    gap="32px"
                    flexWrap="wrap"
                >
                    <Stack>
                        <HStack>
                            <Button
                                size="sm"
                                colorPalette="black"
                                variant="outline"
                                onClick={() => handleZoom(2)}
                            >
                                Zoom +
                            </Button>
                            <Button
                                size="sm"
                                colorPalette="black"
                                variant="outline"
                                onClick={() => handleZoom(0.5)}
                            >
                                Zoom -
                            </Button>
                        </HStack>
                        <Switch.Root
                            size="lg"
                            checked={mouseWheelEnabled}
                            onCheckedChange={(e: { checked: boolean }) =>
                                setMouseWheelEnabled(e.checked)
                            }
                        >
                            <Switch.HiddenInput />
                            <Switch.Control>
                                <Switch.Thumb>
                                    <Switch.ThumbIndicator fallback={<HiX color="black" />}>
                                        <HiCheck />
                                    </Switch.ThumbIndicator>
                                </Switch.Thumb>
                            </Switch.Control>
                            <Switch.Label>Use mouse wheel to zoom</Switch.Label>
                        </Switch.Root>
                        <Switch.Root
                            size="lg"
                            checked={juliaEnabled}
                            onCheckedChange={(e: { checked: boolean }) => {
                                const enabled = e.checked;
                                setJuliaEnabled(enabled);
                                const { width, height } = getCanvasSize(canvasSize, enabled);
                                setPosition((old) =>
                                    getPositionWithAspectRatio(old, width, height),
                                );
                                setPositionJulia((old) =>
                                    getPositionWithAspectRatio(old, width, height),
                                );
                            }}
                        >
                            <Switch.HiddenInput />
                            <Switch.Control>
                                <Switch.Thumb>
                                    <Switch.ThumbIndicator fallback={<HiX color="black" />}>
                                        <HiCheck />
                                    </Switch.ThumbIndicator>
                                </Switch.Thumb>
                            </Switch.Control>
                            <Switch.Label>Show Julia fractal</Switch.Label>
                        </Switch.Root>
                    </Stack>
                </HStack>
                <Box marginTop="8px">
                    <HStack
                        alignItems="end"
                        flexWrap="wrap"
                    >
                        <Field.Root width="max-content">
                            <Field.Label>Max iterations (precision)</Field.Label>
                            <NumberInput.Root
                                maxW="200px"
                                value={iterations.toString()}
                                onValueChange={(e: ValueChangeDetails) =>
                                    setIterations(
                                        e.valueAsNumber > 0
                                            ? e.valueAsNumber < 10001
                                                ? e.valueAsNumber
                                                : 10000
                                            : 1,
                                    )
                                }
                            >
                                <NumberInput.Control />
                                <NumberInput.Input />
                            </NumberInput.Root>
                        </Field.Root>
                        <Select.Root
                            collection={canvasSizes}
                            width="150px"
                            value={[canvasSize]}
                            onValueChange={(e) => {
                                const key = e.value[0] as CanvasSizeKey;
                                const { width, height } = getCanvasSize(key, juliaEnabled);
                                setPosition((old) =>
                                    getPositionWithAspectRatio(old, width, height),
                                );
                                setPositionJulia((old) =>
                                    getPositionWithAspectRatio(old, width, height),
                                );
                                setCanvasSize(key);
                            }}
                        >
                            <Select.HiddenSelect />
                            <Select.Label>Canvas size</Select.Label>
                            <Select.Control>
                                <Select.Trigger>
                                    <Select.ValueText placeholder="Select canvas size" />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content>
                                        {canvasSizes.items.map((size) => (
                                            <Select.Item
                                                item={size}
                                                key={size.value}
                                            >
                                                {size.label}
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                        <ColorPicker.Root
                            value={convergedColor}
                            onValueChange={(e: { value: Color }) => setConvergedColor(e.value)}
                            maxW="140px"
                        >
                            <ColorPicker.HiddenInput />
                            <ColorPicker.Label>Converged color</ColorPicker.Label>
                            <ColorPicker.Control>
                                <ColorPicker.Input />
                                <ColorPicker.Trigger />
                            </ColorPicker.Control>
                            <Portal>
                                <ColorPicker.Positioner>
                                    <ColorPicker.Content>
                                        <ColorPicker.Area />
                                        <HStack>
                                            <ColorPicker.EyeDropper
                                                size="xs"
                                                variant="outline"
                                            />
                                            <ColorPicker.Sliders />
                                        </HStack>
                                    </ColorPicker.Content>
                                </ColorPicker.Positioner>
                            </Portal>
                        </ColorPicker.Root>
                        <Stack>
                            <Slider.Root
                                width="150px"
                                value={[colorOffset]}
                                onValueChange={(e: { value: number[] }) =>
                                    setColorOffset(e.value[0])
                                }
                                max={colorPalette.length ? colorPalette.length - 1 : 1}
                                min={0}
                            >
                                <Slider.Label>Color offset</Slider.Label>
                                <Slider.Control>
                                    <Slider.Track>
                                        <Slider.Range />
                                    </Slider.Track>
                                    <Slider.Thumbs />
                                </Slider.Control>
                            </Slider.Root>
                            <Select.Root
                                collection={colorPalettes}
                                width="150px"
                                value={[colorPaletteKey]}
                                onValueChange={(e: { value: string[] }) => {
                                    setColorPalette(e.value[0] as ColorPaletteKey);
                                    setColorOffset(0);
                                }}
                            >
                                <Select.HiddenSelect />
                                <Select.Label>Color palette</Select.Label>
                                <Select.Control>
                                    <Select.Trigger>
                                        <Select.ValueText placeholder="Select color palette" />
                                    </Select.Trigger>
                                    <Select.IndicatorGroup>
                                        <Select.Indicator />
                                    </Select.IndicatorGroup>
                                </Select.Control>
                                <Portal>
                                    <Select.Positioner>
                                        <Select.Content>
                                            {colorPalettes.items.map((palette) => (
                                                <Select.Item
                                                    item={palette}
                                                    key={palette.value}
                                                >
                                                    {palette.label}
                                                    <Select.ItemIndicator />
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Portal>
                            </Select.Root>
                        </Stack>
                        <Stack>
                            <Button
                                colorPalette="blue"
                                variant="surface"
                                onClick={handleDownloadImage}
                            >
                                Download image
                            </Button>
                            <Button
                                colorPalette="red"
                                variant="surface"
                                onClick={handleResetSettings}
                            >
                                Reset settings
                            </Button>
                        </Stack>
                    </HStack>
                </Box>
            </Stack>
            {/* <Separator /> */}
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            >
                <Mandelbrot
                    ref={mandelbrotRef}
                    width={width}
                    height={height}
                    position={position}
                    iterations={iterations}
                    onPositionChange={(pos) => {
                        setPosition(pos);
                        setPositionJulia(
                            getPositionWithAspectRatio(
                                DEFAULT_POSITION_JULIA,
                                CANVAS_SIZES[canvasSize].width,
                                CANVAS_SIZES[canvasSize].height,
                            ),
                        );
                    }}
                    mouseWheelEnabled={mouseWheelEnabled}
                    colorOffset={colorOffset}
                    convergedColor={convergedColorHex}
                    colorPalette={colorPalette}
                />
                {juliaEnabled && (
                    <Mandelbrot
                        ref={juliaRef}
                        width={width}
                        height={height}
                        position={positionJulia}
                        iterations={iterations}
                        onPositionChange={setPositionJulia}
                        mouseWheelEnabled={mouseWheelEnabled}
                        colorOffset={colorOffset}
                        convergedColor={convergedColorHex}
                        colorPalette={colorPalette}
                        kind="julia"
                        cRe={(position.x1 + position.x2) / 2}
                        cIm={(position.y1 + position.y2) / 2}
                    />
                )}
            </div>
        </>
    );
}

export default App;
