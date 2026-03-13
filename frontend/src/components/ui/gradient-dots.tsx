'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type GradientDotsProps = HTMLMotionProps<"div"> & {
	/** Dot size (default: 1.5) */
	dotSize?: number;
	/** Spacing between dots (default: 32) */
	spacing?: number;
	/** Background color (default: '#020617') */
	backgroundColor?: string;
};

export function GradientDots({
	dotSize = 1.5,
	spacing = 32,
	backgroundColor = '#020617',
	className,
	...props
}: GradientDotsProps) {
	return (
		<div
			className={`absolute inset-0 overflow-hidden ${className}`}
			style={{ backgroundColor } as React.CSSProperties}
			{...props as any}
		>
			{/* ── Subtle Dot Grid ── */}
			<div 
				className="absolute inset-0"
				style={{
					backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.08) ${dotSize}px, transparent ${dotSize}px)`,
					backgroundSize: `${spacing}px ${spacing}px`,
				}}
			/>

			{/* ── High-End Aurora Glows ── */}
			<motion.div 
				animate={{
					scale: [1, 1.2, 1],
					opacity: [0.15, 0.3, 0.15],
				}}
				transition={{
					duration: 12,
					repeat: Infinity,
					ease: "linear"
				}}
				className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none"
			/>
			
			<motion.div 
				animate={{
					scale: [1.2, 1, 1.2],
					opacity: [0.1, 0.2, 0.1],
				}}
				transition={{
					duration: 18,
					repeat: Infinity,
					ease: "linear"
				}}
				className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-violet-600/5 blur-[130px] rounded-full pointer-events-none"
			/>

			{/* ── Subtle Center vignetting ── */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.4)_100%)] pointer-events-none" />
		</div>
	);
}
