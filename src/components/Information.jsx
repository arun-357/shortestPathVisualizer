import React from 'react';

const AlgorithmInfo = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl mt-8'>
      <div className='p-6 rounded-lg shadow-lg bg-gray-800/50 backdrop-blur-md transition-all duration-300 hover:shadow-blue-400/30'>
        <h2 className='text-xl font-semibold text-white mb-3'>Breadth-First Search (BFS)</h2>
        <p className='text-gray-300 text-sm leading-relaxed'>
          BFS explores all nodes at the present depth level before moving to the next depth level.
          It is ideal for finding the shortest path in an **unweighted** graph.
        </p>
        <pre className='bg-gray-900 text-green-400 text-xs p-3 rounded-lg mt-3 overflow-x-auto'>
          {`from collections import deque

def bfs(graph, start):
    queue = deque([start])
    visited = set([start])
    
    while queue:
        node = queue.popleft()
        print(node, end=" ")  # Process node
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

# Example graph
graph = {0: [1, 2], 1: [0, 3, 4], 2: [0, 5], 3: [1], 4: [1, 5], 5: [2, 4]}
bfs(graph, 0)`}
        </pre>
        <a
          href='https://leetcode.com/problems/shortest-path-in-binary-matrix/'
          target='_blank'
          rel='noopener noreferrer'
          className='mt-3 inline-block text-blue-400 hover:text-blue-300'
        >
          🔗 LeetCode: Shortest Path in Binary Matrix
        </a>
      </div>

      <div className='p-6 rounded-lg shadow-lg bg-gray-800/50 backdrop-blur-md transition-all duration-300 hover:shadow-yellow-400/30'>
        <h2 className='text-xl font-semibold text-white mb-3'>Dijkstra's Algorithm</h2>
        <p className='text-gray-300 text-sm leading-relaxed'>
          Dijkstra’s algorithm finds the shortest path in a weighted graph by visiting the least
          costly nodes first. It ensures an optimal solution in graphs with non-negative weights.
        </p>
        <pre className='bg-gray-900 text-yellow-400 text-xs p-3 rounded-lg mt-3 overflow-x-auto'>
          {`import heapq

def dijkstra(graph, start):
    pq = [(0, start)]  # Min heap with (cost, node)
    distances = {node: float('inf') for node in graph}
    distances[start] = 0

    while pq:
        cost, node = heapq.heappop(pq)

        for neighbor, weight in graph[node]:
            new_cost = cost + weight
            if new_cost < distances[neighbor]:
                distances[neighbor] = new_cost
                heapq.heappush(pq, (new_cost, neighbor))
    
    return distances

# Example graph (Adjacency List)
graph = {0: [(1, 4), (2, 1)], 1: [(3, 1)], 2: [(1, 2), (3, 5)], 3: []}
print(dijkstra(graph, 0))`}
        </pre>
        <a
          href='https://leetcode.com/problems/network-delay-time/'
          target='_blank'
          rel='noopener noreferrer'
          className='mt-3 inline-block text-yellow-400 hover:text-yellow-300'
        >
          🔗 LeetCode: Network Delay Time
        </a>
      </div>
    </div>
  );
};

export default AlgorithmInfo;
