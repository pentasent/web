export const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
};

export const fadeInLeft = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 },
};

export const fadeInRight = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 },
};

export const fadeInWithDelay = (index: number) => ({
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, delay: index * 0.1 },
});

export const scaleOnHover = {
    whileHover: { scale: 1.02 },
};

export const fadeInDown = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
};

export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 },
};

export const fadeOut = {
    initial: { opacity: 1 },
    animate: { opacity: 0 },
    transition: { duration: 0.5 },
};

export const slideInFromLeft = {
    initial: { x: -100 },
    animate: { x: 0 },
    transition: { duration: 0.7, ease: "easeOut" },
};

export const slideInFromRight = {
    initial: { x: 100 },
    animate: { x: 0 },
    transition: { duration: 0.7, ease: "easeOut" },
};

export const rotateOnHover = {
    whileHover: { rotate: 10 },
};

export const bounce = {
    animate: { y: [0, -15, 0] },
    transition: { duration: 0.6, repeat: Infinity, repeatType: "loop" },
};

export const zoomIn = {
    initial: { scale: 0 },
    animate: { scale: 1 },
    transition: { duration: 0.5 },
};

export const zoomOut = {
    initial: { scale: 1 },
    animate: { scale: 0 },
    transition: { duration: 0.5 },
};

export const wiggle = {
    animate: { rotate: [0, -10, 10, -10, 0] },
    transition: { duration: 0.5 },
};

export const pulse = {
    animate: { scale: [1, 1.1, 1] },
    transition: { duration: 0.8, repeat: Infinity, repeatType: "reverse" },
};

export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.2,
        },
    },
};

export const staggerFadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
};

export const slideUpOnScroll = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
};

export const scaleOnTap = {
    whileTap: { scale: 0.95 },
};

export const rotateIn = {
    initial: { opacity: 0, rotate: -90 },
    animate: { opacity: 1, rotate: 0 },
    transition: { duration: 0.6 },
};

export const flipIn = {
    initial: { opacity: 0, rotateX: -90 },
    animate: { opacity: 1, rotateX: 0 },
    transition: { duration: 0.6 },
};

export const heartbeat = {
    animate: { scale: [1, 1.2, 1] },
    transition: { duration: 1, repeat: Infinity, repeatType: "reverse" },
};
