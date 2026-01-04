#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      CENTRIFUGO SERVER SDK - TEST SUITE RUNNER             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}\n"

# Check if Centrifugo is running
echo -e "${YELLOW}Checking Centrifugo health...${NC}"
if curl -s http://localhost:8000/health > /dev/null; then
    echo -e "${GREEN}✅ Centrifugo is running${NC}\n"
else
    echo -e "${RED}❌ Centrifugo is not running${NC}"
    echo -e "${YELLOW}Please start Centrifugo with: docker-compose up -d${NC}"
    exit 1
fi

# Check if Redis is running (for queue tests)
echo -e "${YELLOW}Checking Redis...${NC}"
if timeout 1 bash -c 'cat < /dev/null > /dev/tcp/localhost/6379' 2>/dev/null; then
    echo -e "${GREEN}✅ Redis is running${NC}\n"
else
    echo -e "${YELLOW}⚠️  Redis is not running (optional for queue tests)${NC}\n"
fi

# Run tests
echo -e "${BLUE}Running Integration Tests...${NC}\n"
bunx tsx tests/integration.test.ts
INTEGRATION_EXIT=$?

echo -e "\n${BLUE}Running Queue Tests...${NC}\n"
bunx tsx tests/queue.test.ts
QUEUE_EXIT=$?

# Summary
echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    TEST SUMMARY                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}\n"

if [ $INTEGRATION_EXIT -eq 0 ]; then
    echo -e "${GREEN}✅ Integration Tests: PASSED${NC}"
else
    echo -e "${RED}❌ Integration Tests: FAILED${NC}"
fi

if [ $QUEUE_EXIT -eq 0 ]; then
    echo -e "${GREEN}✅ Queue Tests: PASSED${NC}"
else
    echo -e "${RED}❌ Queue Tests: FAILED${NC}"
fi

echo ""

# Exit with appropriate code
if [ $INTEGRATION_EXIT -eq 0 ] && [ $QUEUE_EXIT -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}\n"
    exit 0
else
    echo -e "${RED}⚠️  SOME TESTS FAILED${NC}\n"
    exit 1
fi
