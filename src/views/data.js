// data.js
 // 1. 接入您给定的标准连接桩定义对象（回归原始桩位，去掉扩展编号桩）
export const defaultPorts = {
  groups: {
    top: { position: 'top', attrs: { circle: { r: 0, magnet: true } } },
    bottom: { position: 'bottom', attrs: { circle: { r: 0, magnet: true } } },
    left: { position: 'left', attrs: { circle: { r: 0, magnet: true } } },
    right: { position: 'right', attrs: { circle: { r: 0, magnet: true } } }
  },
  items: [
    { id: 'top', group: 'top' },
    { id: 'bottom', group: 'bottom' },
    { id: 'left', group: 'left' },
    { id: 'right', group: 'right' }
  ]
};

  // 预设最多 5 种不同 source 对应的颜色列表
export const sourceColorPalette = [
  '#ff9900', // 索引 0: 专项债 (橙)
  '#a180ff', // 索引 1: 财政拨款 (紫)
  '#2db7f5', // 索引 2: 自筹资金 (蓝)
  '#19be6b', // 索引 3: 银行贷款 (绿)
  '#ed4014'  // 索引 4: 其他资金 (红)
];
export const response = [
    // ---- 第一层：资金来源 ----
    { "id": "zxj", "name": "专项债", "level": 1, "source": [], "parent": null, "inflowAmount": null },
    { "id": "czbk", "name": "财政拨款", "level": 1, "source": [], "parent": null, "inflowAmount": null },
    { "id": "zczy", "name": "自筹资金", "level": 1, "source": [], "parent": null, "inflowAmount": null }, // 动态扩容测试
    { "id": "ykdk", "name": "银行贷款", "level": 1, "source": [], "parent": null, "inflowAmount": null }, // 动态扩容测试

    // ---- 第二层：核心主体（source 细分来源金额，自身平级记录总额） ----
    { 
      "id": "st_subway", 
      "name": "上海申通地铁", 
      "level": 2, 
      "inflowAmount": "2800.00万元",
      // parents 已重命名为 source
      "source": [
        { "id": "zxj", "amount": "800.00万元" },
        { "id": "czbk", "amount": "2000.00万元" },
        { "id": "zczy", "amount": "2000.00万元" },
        { "id": "ykdk", "amount": "2000.00万元" }
      ],
      // parent 取自原数组中的第一个元素（即 zxj 的对象格式）
      "parent": ''
    },

    // ---- 第三层：项目线路 ----
    { "id": "line_cm", "name": "崇明线", "level": 3, "source": ["zxj", 'czbk'], "parent": "st_subway", "inflowAmount": "2700.00万元" },
    { "id": "line_21", "name": "21号线", "level": 3, "source": ["zxj", 'czbk'], "parent": "st_subway", "inflowAmount": "1000.00万元" },

    // ---- 第四层：建设单位 ----
    { "id": "bj_8", "name": "中建八局", "level": 4, "source": ["zxj", 'czbk'], "parent": "line_cm", "retainedAmount": "1000万元", "inflowAmount": "500.00万元" },
    { "id": "jc_group", "name": "基础工程集团", "level": 4, "source": ["zxj", 'czbk'], "parent": "line_cm", "inflowAmount": "1000.00万元" },
    { "id": "bj_3", "name": "中建三局", "level": 4, "source": ["zxj"], "parent": "line_21", "retainedAmount": "1000万元", "inflowAmount": "500.00万元" },

    // ---- 第五层：末端叶子节点 ----
    { "id": "y_zs", "name": "八局装饰", "level": 5, "source": ["zxj", 'czbk'], "parent": "bj_8", "inflowAmount": "100.00万元" },
    { "id": "y_jd1", "name": "上安机电", "level": 5, "source": ["zxj", 'czbk'], "parent": "bj_8", "inflowAmount": "100.00万元" },
    { "id": "y_lw", "name": "武东建筑劳务", "level": 5, "source": ["zxj", 'czbk'], "parent": "bj_8", "inflowAmount": "100.00万元" },
    { "id": "y_bl", "name": "南玻玻璃", "level": 5, "source": ["zxj"], "parent": "bj_8", "inflowAmount": "100.00万元" },
    { "id": "y_more1", "name": "......", "level": 5, "source": ["zxj", 'czbk'], "parent": "bj_8", "inflowAmount": "100.00万元" },
    
    { "id": "y_jd2", "name": "上安机电", "level": 5, "source": ["zxj"], "parent": "jc_group", "inflowAmount": "100.00万元" },
    
    { "id": "y_dl", "name": "起帆电缆", "level": 5, "source": ["zxj"], "parent": "bj_3", "inflowAmount": "100.00万元" },
    { "id": "y_fj", "name": "上虞风机", "level": 5, "source": ["zxj"], "parent": "bj_3", "inflowAmount": "100.00万元" },
    { "id": "y_yg", "name": "员工", "level": 5, "source": ["zxj"], "parent": "bj_3", "inflowAmount": "100.00万元" },
    { "id": "y_g", "name": "农民工", "level": 5, "source": ["zxj"], "parent": "bj_3", "inflowAmount": "100.00万元" }
];

/**
 * 🌟 终极通用版：以画布高度为范围，严格以 L2 为中轴向上下两侧完美、均匀分布（含宽高等比例缩小兜底）
 * @param {Array} nodesSingleLevel - 当前层级（例如所有 level 1 或所有 level 4）的节点数组
 * @param {number} l2CenterY       - L2 (中心卡片) 的绝对几何中心 Y 坐标 (targetNode.y + height/2)
 * @param {number} canvasHeight    - 画布的总可用高度
 * @param {number} minGap          - 允许的垂直最小安全隔离间距（像素兜底，默认 20）
 */
function calculateGenericLevelYWithScale(nodesSingleLevel, l2CenterY, canvasHeight, minGap = 20) {
  const nodes = nodesSingleLevel || [];
  const count = nodes.length;
  if (count === 0) return;

  // 💡 1. 设定全画布的最大边界安全防线（保留上下各 40px 的绝对边缘视口隔离带）
  const maxAllowedHeight = canvasHeight - 80;

  // 💡 2. 统计在不缩放状态下，该层所有卡片自身的物理高度绝对总和
  let totalNodeHeight = 0;
  nodes.forEach(node => { totalNodeHeight += node.height; });

  let currentGap = minGap;
  let scaleFactor = 1.0;

  if (count === 1) {
    // 🌟 特殊兜底：单节点直接死死钉在 L2 的中轴线上
    nodes[0].y = Math.round(l2CenterY - nodes[0].height / 2);
    return;
  }

  // 💡 3. 计算弹性可用剩余空白间距总额
  const availableSurplusSpace = maxAllowedHeight - totalNodeHeight;
  const gapCount = count - 1;

  // 💡 4. 核心空间平分调度决策器
  if (availableSurplusSpace >= gapCount * minGap) {
    // 🟢 情况 A（空间极度宽裕，2-5个节点动态铺满全场）：
    // 弹性空白空间极其充沛，直接完美、均匀地把整个画布的高度平摊给各个间距，不缩放宽高！
    currentGap = availableSurplusSpace / gapCount;
  } else {
    // 🔴 情况 B（节点暴增，产生极限挤压或重叠）：
    // 连最小的 minGap 都放不下了！瞬间触发宽高和间距的全局等比例缩小保护网！
    const idealTotalHeight = totalNodeHeight + (gapCount * minGap); // 理想总高度
    scaleFactor = maxAllowedHeight / idealTotalHeight;
    
    // 限制过度压扁：最小允许缩到原本的 0.5 倍
    scaleFactor = Math.max(scaleFactor, 0.5);
    currentGap = minGap * scaleFactor;

    nodes.forEach(node => {
      // 宽高同步压缩
      node.width = Math.round(node.width * scaleFactor);
      node.height = Math.round(node.height * scaleFactor);
    });
  }

  // 💡 5. 重新统计处理后的全层节点最终物理总占用高度
  let finalTotalHeight = 0;
  nodes.forEach(node => { finalTotalHeight += node.height; });
  finalTotalHeight += (count - 1) * currentGap;

  // 🌟 6. 以 L2 中心 Y 坐标为终极天平，向上下两侧完美对称铺设 Y 坐标，达成 100% 垂直等高对称
  let currentY = l2CenterY - (finalTotalHeight / 2);

  nodes.forEach(node => {
    node.y = Math.round(currentY);
    // 指针向下平滑推进
    currentY += node.height + currentGap;
  });
}


/**
 * 纯动态几何推导：根据原始层级列表数据，全量自动生成带有精准对齐坐标和桩位的节点与边数据
 * @param {Array} response 原始输入数组（全动态自适应）
 * @param {Object} options 间距微调配置项（可选）
 * @returns {Object} { NODE_DATA, EDGE_DATA }
 */
export function transformListToAlignedTopology(response, containerDOM, options = {}) {
  const canvasWidth = containerDOM ? containerDOM.clientWidth : 1200; 
  const canvasHeight = containerDOM ? containerDOM.clientHeight : 600;

  // 2. 严格按照画布总宽度的百分比/比例系数划分
  const widthRatios = {
    1: options.ratio1 || 0.08,  // 第一级：占画布总宽 8%
    2: options.ratio2 || 0.26,  // 第二级：占画布总宽 26%
    3: options.ratio3 || 0.48,  // 第三级：占画布总宽 48%
    4: options.ratio4 || 0.70,  // 第四级：占画布总宽 70%
    5: options.ratio5 || 0.90   // 第五级：占画布总宽 90%
  };

  const config = {
    colX: { 
      1: Math.round(widthRatios[1] * canvasWidth),
      2: Math.round(widthRatios[2] * canvasWidth),
      3: Math.round(widthRatios[3] * canvasWidth),
      4: Math.round(widthRatios[4] * canvasWidth),
      5: Math.round(widthRatios[5] * canvasWidth)
    },
    leafGap: options.leafGap || 35,
    branchGap: options.branchGap || 220,
    canvasCenterY: options.canvasCenterY || 270
  };

  // 3. 动态读取结构，按层级划分并初始化各节点的默认宽高及类型
  const nodeMap = {};
  const nodesByLevel = { 1: [], 2: [], 3: [], 4: [], 5: [] };

  response.forEach(item => {
    let width = 110, height = 44;
    let type = undefined;

    if (item.level === 1) {
      type = 'source-node';
    } else if (item.level === 2) {
      width = 120; 
      height = 120; 
      type = 'center-card';
    } else if (item.level === 3) {
      type = 'line-node';
    } else if (item.level === 4) {
      width = 150; 
      height = item.retainedAmount ? 54 : 44; 
      type = 'target-card';
    } else if (item.level === 5) {
      width = 10; height = 20;
    }

    nodeMap[item.id] = {
      ...item,
      width,
      height,
      type,
      x: config.colX[item.level], 
      y: 0,
      children: []
    };
    nodesByLevel[item.level].push(nodeMap[item.id]);
  });

  // 4. 构建父子反向索引网络
  response.forEach(item => {
    if (item.level === 2) {
      if (item.source && item.source.length > 0) {
        item.source.forEach(src => {
          const parentId = typeof src === 'object' ? src.id : src;
          if (nodeMap[parentId]) {
            nodeMap[parentId].children.push(nodeMap[item.id]);
          }
        });
      }
    } else if (item.level >= 3) {
      const parentId = item.parent;
      if (parentId && nodeMap[parentId]) {
        nodeMap[parentId].children.push(nodeMap[item.id]);
      }
    }
  });


  // ==================== 一、Y 坐标核心动态几何推导 ====================
  // 【3】反向确定第 2 层（核心主体）的 Y 坐标
  nodesByLevel[2].forEach(l2Node => {
    l2Node.y = config.canvasCenterY - (l2Node.height / 2);
  });

  nodesByLevel[1].forEach(node => { node.type = 'source-node'; }); // 统一更名为 source-node
  calculateGenericLevelYWithScale(nodesByLevel[1],nodesByLevel[2][0].y, canvasHeight, 20);

  // 【1】确立核心主干线路的垂直中心线
  const level3Nodes = nodesByLevel[3];
  level3Nodes.forEach((l3Node, index) => {
    const mainBranchCenterY = config.canvasCenterY - ((level3Nodes.length - 1) * config.branchGap / 2) + (index * config.branchGap);
    l3Node.y = mainBranchCenterY - (l3Node.height / 2);

    const l4Children = l3Node.children.filter(c => c.level === 4);
    if (l4Children.length > 0) {
      const mainL4 = l4Children[0];
      mainL4.y = mainBranchCenterY - (mainL4.height / 2);

      if (l4Children.length > 1) {
        for (let i = 1; i < l4Children.length; i++) {
          l4Children[i].y = l4Children[i - 1].y + l4Children[i - 1].height + 51;
        }
      }
    }
  });

  // 【2】全动态“垂直居中对称”推导第 5 层叶子节点的 Y 坐标
  nodesByLevel[4].forEach(l4Node => {
    const leaves = l4Node.children.filter(c => c.level === 5);
    if (leaves.length === 0) return;

    const parentCenterY = l4Node.y + (l4Node.height / 2);
    const totalLeavesHeight = (leaves.length - 1) * config.leafGap;
    
    let startY = parentCenterY - (totalLeavesHeight / 2) - (leaves[0].height / 2);

    leaves.forEach(leaf => {
      leaf.y = startY;
      startY += config.leafGap; 
    });
  });

  // 【3】反向确定第 2 层（核心主体）的 Y 坐标
  nodesByLevel[2].forEach(l2Node => {
    l2Node.y = config.canvasCenterY - (l2Node.height / 2);
  });

  // 【4】反向确定第 1 层（资金来源）的 Y 坐标
  const level1Nodes = nodesByLevel[1];
  const mainL2Node = nodesByLevel[2][0];
  if (mainL2Node && level1Nodes.length >= 2) {
    level1Nodes[0].y = mainL2Node.y - 60;
    level1Nodes[1].y = mainL2Node.y + mainL2Node.height + 20;
  }


  // ==================== 二、结构体全自动化组装 ====================

  // 1. 构建输出带有物理坐标及连接端口的 NODE_DATA
  const NODE_DATA = response.map(item => {
    const cached = nodeMap[item.id];
    const targetIndex = nodesByLevel[item.level].findIndex(n=> n.id == item.id)
    const res = {
      id: item.id,
      x: Math.round(cached.x),
      y: Math.round(cached.y),
      width: cached.width,
      height: cached.height,
      label: item.name,
      ports: defaultPorts ,
      parent: item.parent,
      level: item.level,
      levelIndex: targetIndex
    };

    if (cached.type) res.type = cached.type;
    if (item.retainedAmount) res.subLabel = `留存金额：${item.retainedAmount}`;
    
    return res;
  });

  // 2. 纯动态提取流式链接关系，生成带有精准引出/引入桩配置的 EDGE_DATA
  let EDGE_DATA = [];
  const unionMap = new Map()
  response.forEach(item => {
    const currentId = item.id;

    // 情况 A：处理 Level 2 核心主体（依据自己的 source 数组上溯到多源头）
    if (item.level === 2 && item.source && item.source.length > 0) {
      item.source.forEach((src, sIdx) => {
        const srcId = typeof src === 'object' ? src.id : src;
        const amount = typeof src === 'object' ? src.amount : '';

        const lineColor = sourceColorPalette[sIdx] || '#ff9900';

        EDGE_DATA.push({
          sourceId: srcId,
          sourcePort:'right',
          targetId: currentId,
          targetPort: 'left',
          color: lineColor,
          labelText: amount,
          sourceTotal: item.source.length, // 1~2层连线一并补齐多线参数，方便统一处理
          level: 1,
          sourceIndex: sIdx
        });
      });
    }

    // 情况 B：处理 Level 3 级节点（核心修改点：统一接入 left 桩位，走偏移标记）
    if (item.level === 3 && item.parent) {
      const parentId = item.parent;
      const parentNode = nodeMap[parentId];
      const inflowAmount = item.inflowAmount || '';

      // 核心研判：如果父级节点（核心主体）拥有多源资金，且当前是主干的第一条线路，触发多平行线生成
      if (item.source && item.source.length > 1) {
        const sourceTotal = item.source.length;

        item.source.forEach((src, sIdx) => {
          const lineColor = sourceColorPalette[sIdx] || '#ff9900';

          EDGE_DATA.push({
            sourceId: parentId,
            sourcePort:'right',
            targetId: currentId,
            targetPort: 'left',            // 【重要修改】：不再扩展桩位名，统一指向左连接桩
            color: lineColor,
            labelText: sIdx === 0 ? inflowAmount : '', // 仅在第一条主线上挂载金额
            sourceTotal,                  // 平行线总数
            level: parentNode.level,
            sourceIndex: sIdx             // 当前线颜色/来源索引位置
          });
        });
      } else {
        // 普通单线（例如21号线）
        EDGE_DATA.push({
          sourceId: parentId,
          sourcePort:'right',
          targetId: currentId,
          targetPort: 'left',
          color: sourceColorPalette[0],
          labelText: inflowAmount,
          sourceTotal: 1,
          level: parentNode.level,
          sourceIndex: 0
        });
      }
    }

    // 情况 C：处理 Level 4 和 Level 5 节点
    if (item.level >= 4 && item.parent) {
      const parentId = item.parent;
      const parentNode = nodeMap[parentId];
      const inflowAmount = item.inflowAmount || '';

      // 将当前等级的source集合一下
      const groupKey = `${item.parent}_${item.level}`;
      
      if (!unionMap.has(groupKey)) {
        unionMap.set(groupKey, new Set());
      }
      
      const currentSet = unionMap.get(groupKey);
      item.source.forEach(src => currentSet.add(src));
      unionMap.set(groupKey, currentSet)

      const sourceTotal = item.source.length;

      item.source.forEach((src, sIdx) => {
        const lineColor = sourceColorPalette[sIdx] || '#ff9900';

        EDGE_DATA.push({
          sourceId: parentId,
          sourcePort: 'right',
          targetId: currentId,
          targetPort: "left", 
          lineSource:src,
          color: lineColor,
          labelText: sIdx === 0 ? inflowAmount : '', // 仅在第一条主线上挂载金额
          sourceTotal,                  // 平行线总数
          level: parentNode.level,
          sourceIndex: sIdx             // 当前线颜色/来源索引位置
        });
      });
    }
  });
  EDGE_DATA = EDGE_DATA.map(item =>{
    const groupKey = `${item.sourceId}_${item.level+1}`;
    const setArray = Array.from(unionMap.get(groupKey) || []);
    let colorIndex = setArray.indexOf(item.lineSource);
    return {
      ...item,
      colorIndex,
      colorTotal: setArray.length
    };
  })
  return { NODE_DATA, EDGE_DATA };
}



