import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedContentProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export const AnimatedSection: React.FC<AnimatedContentProps> = ({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedCard: React.FC<AnimatedContentProps> = ({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedList: React.FC<AnimatedContentProps> = ({
  children,
  className = "",
  delay = 0,
  duration = 0.4,
}) => {
  return (
    <motion.ul
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={`space-y-4 ${className}`}
    >
      {children}
    </motion.ul>
  );
};

export const AnimatedListItem: React.FC<AnimatedContentProps> = ({
  children,
  className = "",
  delay = 0,
  duration = 0.4,
}) => {
  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={`flex items-start space-x-3 ${className}`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.3,
          delay: delay + 0.1,
          ease: "easeOut",
        }}
        className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"
      />
      <span className="text-gray-700">{children}</span>
    </motion.li>
  );
};

export const AnimatedQuote: React.FC<AnimatedContentProps> = ({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
}) => {
  return (
    <motion.blockquote
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={`bg-linear-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 px-6 pt-2 rounded-r-lg italic text-gray-700 ${className}`}
    >
      {children}
    </motion.blockquote>
  );
};

export const AnimatedDiagram: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ title, children, className = "", delay = 0 }) => {
  return (
    <AnimatedCard
      className={`relative overflow-hidden ${className}`}
      delay={delay}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1, delay: delay + 0.2, ease: "easeOut" }}
        className="absolute top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600"
      />
      <h3 className="text-lg font-semibold mb-4 text-gray-900 relative z-10">
        {title}
      </h3>
      <div className="relative z-10">{children}</div>
    </AnimatedCard>
  );
};

export const AnimatedTimeline: React.FC<{
  items: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  className?: string;
}> = ({ items, className = "" }) => {
  return (
    <div className={`space-y-8 ${className}`}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
          className="relative pl-8"
        >
          <div className="absolute left-0 top-2 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">{item.icon}</span>
          </div>
          <div className="ml-6">
            <h4 className="font-semibold text-gray-900">{item.title}</h4>
            <p className="text-gray-600 mt-1">{item.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export const AnimatedComparison: React.FC<{
  left: {
    title: string;
    items: string[];
    color: string;
  };
  right: {
    title: string;
    items: string[];
    color: string;
  };
  className?: string;
}> = ({ left, right, className = "" }) => {
  return (
    <div className={`grid md:grid-cols-2 gap-6 ${className}`}>
      <AnimatedCard className={`border-${left.color}-200`} delay={0}>
        <div className={`w-3 h-3 bg-${left.color}-500 rounded-full mb-3`} />
        <h3 className="font-semibold text-gray-900 mb-4">{left.title}</h3>
        <AnimatedList>
          {left.items.map((item, index) => (
            <AnimatedListItem key={index} delay={index * 0.1}>
              {item}
            </AnimatedListItem>
          ))}
        </AnimatedList>
      </AnimatedCard>

      <AnimatedCard className={`border-${right.color}-200`} delay={0.2}>
        <div className={`w-3 h-3 bg-${right.color}-500 rounded-full mb-3`} />
        <h3 className="font-semibold text-gray-900 mb-4">{right.title}</h3>
        <AnimatedList>
          {right.items.map((item, index) => (
            <AnimatedListItem key={index} delay={index * 0.1}>
              {item}
            </AnimatedListItem>
          ))}
        </AnimatedList>
      </AnimatedCard>
    </div>
  );
};

export const AnimatedMindMap: React.FC<{
  title: string;
  nodes: Array<{
    id: string;
    label: string;
    position: { x: number; y: number };
    connections: string[];
    color?: string;
  }>;
  className?: string;
}> = ({ title, nodes, className = "" }) => {
  return (
    <AnimatedCard className={`relative overflow-hidden ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      <div className="relative w-full h-64 bg-linear-to-br from-indigo-50 to-purple-50 rounded-lg">
        {/* Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {nodes.map((node) =>
            node.connections.map((targetId) => {
              const target = nodes.find((n) => n.id === targetId);
              if (!target) return null;

              return (
                <motion.line
                  key={`${node.id}-${targetId}`}
                  x1={node.position.x}
                  y1={node.position.y}
                  x2={target.position.x}
                  y2={target.position.y}
                  stroke="#6366f1"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="drop-shadow-sm"
                />
              );
            }),
          )}
        </svg>

        {/* Nodes */}
        {nodes.map((node, index) => (
          <motion.div
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            className="absolute"
            style={{
              left: node.position.x - 40,
              top: node.position.y - 20,
            }}
          >
            <div
              className={`w-20 h-10 bg-${node.color || "indigo"}-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white`}
            >
              <span className="text-white text-xs font-semibold text-center px-2">
                {node.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatedCard>
  );
};

export const AnimatedPageNavigator: React.FC<{
  pages: Array<{
    id: string;
    title: string;
    content: React.ReactNode;
  }>;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}> = ({ pages, currentPage, onPageChange, className = "" }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Page Indicators */}
      <div className="flex justify-center space-x-2">
        {pages.map((page, index) => (
          <button
            key={page.id}
            onClick={() => onPageChange(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentPage
                ? "bg-indigo-500 scale-125 shadow-lg"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Page Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
        >
          <div className="prose prose-lg max-w-none text-gray-800">
            {pages[currentPage].content}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>⬅️</span>
          <span>Trước</span>
        </button>

        <button
          onClick={() =>
            onPageChange(Math.min(pages.length - 1, currentPage + 1))
          }
          disabled={currentPage === pages.length - 1}
          className="flex items-center space-x-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Sau</span>
          <span>➡️</span>
        </button>
      </div>
    </div>
  );
};
